const { normalizeToMin, timeRound } = require('./lib.js');
const MapReduce = require('./mapreduce.js');

module.exports = async function(appDb, PROFILE, PROVIDER) {
  if(typeof PROFILE == 'undefined') {
    throw new Error('PROFILE expected');
  }
  
  /*
    //connect to appDB
    var appDb = connectAppDb();
  */
  
  var Log = {profile: PROFILE.name};
  
  var sourceCollection = (PROFILE.resolution)? PROVIDER.collection: PROVIDER.rawCollection;
  var destCollection = PROVIDER.collection;
  var scope = PROVIDER.scope;
  scope.PROFILE = PROFILE;
  
  var query = {
    'value.res': PROFILE.resolution || null,
    // this is to trick MongoDB and use the single compound index
    // for queries with appId and not
    // in this case, we need to get all the apps
    'value.appId': {$ne: "c90153bf-147d-41e5-86e7-584872a61d2b"}
  };
  
  Log.startedAt = new Date();
  
  var profileConfigQuery = {
    _id: {
      profile: PROFILE.name,
      provider: PROVIDER.name,
      shard: process.env.MONGO_SHARD
    }
  };
  
  if(process.env.SUBSHARD_COUNT) {
    var subShardSegmentId = process.env.SUBSHARD_COUNT + ":" + process.env.SUBSHARD_SEGMENT;
    console.log(' processing subShard: ' + subShardSegmentId);
    // setting the subSharding modulus selector in the query
    query['value.subShard'] = {$mod: [parseInt(process.env.SUBSHARD_COUNT), parseInt(process.env.SUBSHARD_SEGMENT)]};
  }
  
  var config = await appDb.collection('mapReduceProfileConfig').findOne(profileConfigQuery);
  if(config){
    var lastTime = config.lastTime.getTime();
  
    // selecting the subSharding time
    if(subShardSegmentId) {
      if(config.subShardTimes && config.subShardTimes[subShardSegmentId]) {
        lastTime = config.subShardTimes[subShardSegmentId];
      }
  
      // time range exceeds, so set it to a fresh time
      if((Date.now() - lastTime) > PROFILE.maxAllowedRange) {
        lastTime = config.lastTime.getTime();
        console.log(' too long range to aggregate. resetting to: ' + config.lastTime);
      }
    }
  
    // We must normalize the time. Otherwise, we'll be loading values for half of
    // single time range. It will leads for wrong counts.
    // That will lead to wrong rates. This will fix it. 
    var begin = timeRound(lastTime - PROFILE.reverseMillis, PROFILE);
  
    query['value.startTime'] = {
      $gte: new Date(begin),
      $lt: Log.startedAt
    };
  } else {
    console.log('NO CONFIG DEFINED!');
  }
  
  //applying map reduce
  var options = {
    query: query,
    out: {'merge': destCollection},
    sort: {
      "value.res": 1,
      "value.startTime": 1
    },
    finalize: PROVIDER.finalize,
    scope: scope,
    jsMode: true
  };
  
  console.log(JSON.stringify(query));
  
  console.log("  Using local MR");
  await MapReduce(appDb, sourceCollection, destCollection, PROVIDER.map, PROVIDER.reduce, options);
  
  Log.elapsedTime = Date.now() - Log.startedAt.getTime();
  
  var entries = await appDb.collection(destCollection).find({
    // we are using following query and sort because of the index we are utilizing
    "value.res": PROFILE.name,
  }).limit(1).toArray();
  
  // this is debug check to see whether we can use this
  if(entries[0]){
    var startFrom = normalizeToMin(Log.startedAt.getTime());
  
    var selector = profileConfigQuery;
    var modifier = {
      $set: {
        lastTime: startFrom
      }
    };
  
    if(subShardSegmentId) {
      modifier['$set']['subShardTimes.' + subShardSegmentId] = startFrom;
    }
  
    var options = {upsert:true};
    await appDb.collection('mapReduceProfileConfig').update(selector, modifier, options);
    await appDb.collection('rmaLogs').insert(Log);
  } else {
    console.log('very strange! - no entries found')
  }
}
