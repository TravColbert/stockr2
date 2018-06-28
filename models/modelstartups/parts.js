module.exports = function(app) {
  (function() {
    /**
     * Setup a model here.
     * Maybe you need to pre-populate a table or something.
     */
    let myName = "parts module startup";
    let demoPart = {
      partnum : "12345.678",
      make : "Acme",
      description : "pre-loaded giant spring",
      notes : "to be used on unsuspecting road-runners",
      cost : 100.99,
      price : 999.99,
      location : "Desert Warehouse, shelf 2",
      mincount : 1,
      maxcount : 3,
      inwarranty : true
    }
    app.controllers["parts"].__get({where:{partnum:demoPart.partnum}})
    .then(parts => {
      if(parts.length>0) return true;
      app.log("Pre-populating the parts table...",myName,6);
      return app.controllers["default"].get("domains",{where:{name:"Default Domain"}});
    })
    .then(domains => {
      if(domains===true) return true;
      if(domains===null || domains.length<1) {
        app.log("Could not find default domain to add demo material",myName,4);
        return false;
      }
      app.log("Found default domain: " + domains[0],myName,6);
      demoPart.domainId = domains[0].id;
      demoPart.userId = domains[0].ownerId;
      return app.controllers["parts"].__create(demoPart);
    })
    .catch(err => {
      app.log("Something went wrong pre-populating table: " + err.message,myName,3,"!!!");
      return new Error("(" + myName + "): " + err.message);
    })
  })(app);
}