const { MongoClient } = require('mongodb');
const { program } = require('commander');
const profiles = require('./profiles');
const providers = require('./providers');
const incrementalAggregation = require('./incremental-aggregation.js');

program
  .option('--mongo-url <uri>', 'The URI used to connect to a Mongo database.')
  .option('--profile <profile>', 'Allowed values: [1min, 30min, 3hour]')
  .option('--provider <provider>', 'Allowed values: [errors, methods, pubsub, system]')
  .option('--type <type>', 'Allowed values: [incremental, batch]')
  .action(async function(args) {
    let exitCode = 0;
    const client = new MongoClient(args.mongoUrl);
    try {
      await client.connect();
    
      const db = client.db("apm");
      const PROFILE = profiles[args.profile];
      const PROVIDER = providers[args.provider];

      console.log(args)
      if (args.type === "incremental") {
        await incrementalAggregation(db, PROFILE, PROVIDER);
      }
    } catch (err) {
      exitCode = 1;
      console.error(err);
    }
    
    setTimeout((e) => {
      client.close();
      process.exit(e);
    }, 1000, exitCode);

  })

program.parse();