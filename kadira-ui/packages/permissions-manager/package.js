Package.describe({
  summary: "Permissions Manager for Kadira UI",
  name: "local:permissions-manager"
});


Package.onUse(function(api) {
  api.addFiles("lib/permissions_manager.js", ["client", "server"]);
  api.addFiles("lib/roles.js", ["client", "server"]);
  api.versionsFrom('METEOR@1.0');
  api.use('underscore');
  api.use('mongo');
  api.use('tracker');
  api.export("PermissionsMananger", ["client", "server"]);
});

Package.onTest(function(api) {
  api.use(["local:permissions-manager", "practicalmeteor:sinon", "tinytest", "test-helpers"]);
  api.addFiles("test/lib/permissions_manager.js", ["client", "server"]);
});