Package.describe({
  summary: "Jobs API for Kadira UI",
  name: "local:jobs"
});

Npm.depends({"aws-sdk": "2.0.18"});

Package.onUse(function (api, where) {
  configurePackage(api);
  
  api.export(['Job','Jobs'], ['client', 'server']);
  api.export(['JobsCollection'], {testOnly: true});
});

Package.onTest(function (api) {
  configurePackage(api);
  api.use('tinytest');
  api.use('test-helpers');

  api.addFiles('test/client/job.js', ['client']);
});

function configurePackage(api) {
  api.versionsFrom('METEOR@1.0');
  api.use('livedata');
  api.use('mongo-livedata');
  api.use('audit-argument-checks');
  api.use('meteorhacks:subs-manager');
  api.addFiles('lib/client/job.js', 'client');
  api.addFiles(['lib/collections.js', 'lib/jobs.js'], ['client','server']);
  api.addFiles(['lib/server/methods.js', 'lib/server/publications.js'], 'server');
}