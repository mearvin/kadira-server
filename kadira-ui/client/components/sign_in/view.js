Template.signIn.events({
  "submit #sign-in-with-email": function(e, tmpl) {
    e.preventDefault();
    var email = tmpl.$("input[name=email]").val();
    var password = tmpl.$("input[name=password]").val();
    FlowComponents.callAction("signInWithEmail", email, password);
  },
  "submit #sign-up-with-email": function(e, tmpl) {
    e.preventDefault();
    const email = tmpl.$("input[name=email]").val();
    const password = tmpl.$("input[name=password]").val();
    FlowComponents.callAction("signUpWithEmail", email, password);
  }
});