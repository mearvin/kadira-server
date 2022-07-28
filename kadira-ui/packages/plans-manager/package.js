Package.describe({
  summary: "Plans Manager for Kadira UI",
  name: "local:plans-manager"
});

Package.onUse(function(api) {
  api.use(["underscore"])
  api.export("PlansManager", ["client", "server"]);
  api.addFiles("lib/plans_manager.js", ["client", "server"]);
});

Package.onTest(function(api) {
  api.use(["local:plans-manager", "tinytest", "test-helpers"]);
  api.addFiles("test/lib/plans-manager.js", ["client", "server"]);
});