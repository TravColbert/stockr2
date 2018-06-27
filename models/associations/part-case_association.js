module.exports = function(app) {
  (function() {
    let myName = "part-case association";
    app.log("Invoking association",myName,6,"x x x");
    app.models["parts"].belongsToMany(app.models["cases"],{through:"PartCase"});
  })(app);
}
