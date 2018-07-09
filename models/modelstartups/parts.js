module.exports = function(app) {
  (function() {
    /**
     * Setup a model here.
     * Maybe you need to pre-populate a table or something.
     */
    let myName = "parts module startup";
    let demoPart = {
      partNum : "12345.678",
      make : "Acme",
      description : "pre-loaded giant spring",
      notes : "to be used on unsuspecting road-runners",
      cost : 100.99,
      price : 999.99,
      location : "Desert Warehouse, shelf 2",
      minCount : 1,
      maxCount : 3,
      inWarranty : true
    }
    let demoCase = {
      name : "STOCKR_DEMO_CASE.1",
      description: "This is a demo case",
      notes: "This is not a real case. It is meant to demonstrate the manipulation of cases in Stockr"
    }
    app.controllers["parts"].__get({where:{partNum:demoPart.partNum}})
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
    .then(part => {
      app.log("Newly-created demo part: " + part.partNum);
      demoCase.domainId = 1;
      demoCase.userId = 1;
      app.log("Adding new demo case: " + demoCase);
      app.controllers["cases"].__create(demoCase)
      .then((demoCase) => {
        app.log("This is the demo case: " + demoCase.name,myName,6);
        return part.addCase(demoCase);
      })
      .catch(err => {
        return new Error("(" + myName + "): " + err.message);
      });
      // return part;
    })
    .catch(err => {
      app.log("Something went wrong pre-populating table: " + err.message,myName,3,"!!!");
      return new Error("(" + myName + "): " + err.message);
    })
  })(app);
}