module.exports = function(app) {
  (function() {
    let myName = "user associations";
    app.log("Invoking association",myName,6,"x x x");
    app.models["cases"].belongsTo(app.models["users"],{as:"user"});         // makes cases.userId
    app.models["parts"].belongsTo(app.models["users"],{as:"user"});         // makes parts.userId
  })(app);
}

