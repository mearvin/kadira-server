Package.describe({
  summary: "Kadira collections",
  name: "local:collections"
});

Package.onUse(function(api) {
  api.versionsFrom(['1.0', '2.5']);
  api.use("mongo");
  api.addFiles("lib/collections.js", ["client", "server"]);

  api.export("Apps", ["client", "server"]);
  api.export("PendingUsers", ["client", "server"]);
  api.export("Alerts", ["client", "server"]);
  api.export("ErrorsMeta", ["client", "server"]);
});