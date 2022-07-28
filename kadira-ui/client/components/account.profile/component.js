import IsMobile from 'ismobilejs'

var component = FlowComponents.define("account.profile", function() {
});

component.action.reconnectMeteorDevAccount = function() {
  var options = {};
  // if(IsMobile.any) {
  //   options.loginStyle = "redirect";
  // }
  // options.redirectUrl = "http://localhost:3000/_oauth/meteor-developer?close"

  Meteor.loginWithMeteorDeveloperAccount(options, this.showError.bind(this));
};

component.prototype.showError = function(error) {
  if(error) {
    var errorMessage = error.reason || error.message;
    growlAlert.error(errorMessage);
  } else {
    growlAlert.success("Meteor Account Connected Successfully.");
  }
};
