module.exports = function(app) {
  (function() {
    let myName = "domain associations";
    app.log("Invoking association",myName,6,"x x x");
    app.models["cases"].belongsTo(app.models["domains"],{as:"domain"});         // makes cases.domainId
    app.models["parts"].belongsTo(app.models["domains"],{as:"domain"});         // makes parts.domainId
  })(app);
}

