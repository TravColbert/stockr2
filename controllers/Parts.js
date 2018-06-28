module.exports = function(app,model) {
  if(!model) return false;
  let myName = model + "Controller";
  let myModel = model;
  let requiredFields = ["partnum"];
  let optionalFields = ["make","description","notes","cost","price","location","mincount","maxcount","inwarranty","userId","domainId"];
  obj = {
    __create : function(obj) {
      let myName = "__create";
      app.log("Creating obj: " + obj,myName,6);
      return app.controllers["default"].create(model,obj);
    },
    __get : function(obj) {
      let myName = "__get";
      app.log("Getting obj: " + obj,myName,6);
      return app.controllers["default"].get(model,obj);
    },
    __update : function(obj) {
      let myName = "__update";
      app.log("Updating obj: " + obj,myName,6);
      return app.controllers["default"].update(model,obj);
    },
    __delete : function(obj) {
      let myName = "__delete";
      app.log("Deleting obj: " + obj,myName,6);
      return app.controllers["default"].delete(model,obj);
    },

    countConsumed : function(partId) {
      let myName = "countUsed";
      return new Promise((resolve,reject) => {
        app.log("Counting consumed parts of ID: " + partId,myName,6);
        app.controllers[model].__get({ id:partId })
        .then(parts => {
          return parts[0].getCases();
        })
        .then(cases => {
          app.log("Number of consumed parts of ID: " + partId + " is: " + cases.length,myName,6);
          resolve(cases.length);
        })
        .catch(err => {
          reject(new Error("(" + myName + "): " + err.message));
        });  
      });
    },
    countFree : function(partId) {
      let myName = "countFree";
      return new Promise((resolve,reject) => {
        let maxParts;
        app.log("Counting free parts of ID: " + partId,myName,6);
        app.controllers[model].__get({ id:partId })
        .then(parts => {
          maxParts = parts[0].maxcount;
          return parts[0].getCases();
        })
        .then(cases => {
          app.log("Number of consumed parts of ID: " + partId + " is: " + cases.length,myName,6);
          app.log("NUmber of free parts for part ID: " + partId + " is: " + (maxParts-cases.length),myName,6);
          resolve(maxParts-cases.length);
        })
        .catch(err => {
          reject(new Error("(" + myName + "): " + err.message));
        });  
      });
    },
    getCases : function(partId) {
      let myName = "getCases";
      app.log("Getting cases for part ID: " + partId,myName,6);
      app.controllers[model].__get({ id:partId })
      .then(parts => {
        return parts[0].getCases();
      })
      .then(cases => {
        app.log("Cases attached to part ID: " + partId + " : " + cases.length,myName,6);
        return cases;
      })
      .catch(err => {
        return new Error("(" + myName + "): " + err.message);
      })
    },
    checkout : function(partId,caseId) {
      let myName = "checkout";
      return new Promise((resolve,reject) => {
        if(!partId) reject(new Error("No part ID given"));
        if(!caseId) reject(new Error("No case ID given"));
        let searchObj = {
          id : partId
        }
        let partItem;
        let caseItem;
        app.controllers[model].__get(searchObj)
        .then((parts) => {   // remember ["default"].get returns an array!
          if(parts===null || parts===undefined) reject(new Error("Part ID: " + searchObj.id + " not found"));
          partItem = parts[0];
          searchObj = {
            id : caseId
          }
          return app.controllers["cases"].get(searchObj);
        })
        .then((cases) => {
          if(cases===null || cases===undefined) reject(new Error("Case ID: " + searchObj.id + " not found"));
          caseItem = cases[0];
          return partItem.addCase(caseItem);
        })
        .then((response) => {
          app.log("This is what happened: " + response,myName,6);
        })
        .catch(err => {
          reject(err);
        })
      });
    },

    create : function(req,res,next) {
      let myName = "create";
      let newItem = app.tools.pullParams(req.body,requiredFields);
      if(!newItem) return res.send("Required field missing... try again");
      newItem = app.tools.addProperties(req.body,optionalFields,newItem);
      app.log("New item: " + JSON.stringify(newItem),myName,6,"::::>");
      app.tools.checkAuthorization(["create","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to create parts",myName,6);
        return app.controllers[model].__create(newItem);
      })
      .then(item => {
        req.appData.part = item;
        req.appData.view = "part";
        return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },
    gets : function(req,res,next) {
      let myName = "gets";
      let searchObj = {
        where: {
          domainId: req.session.user.currentDomain.id
        }
      }
      app.tools.checkAuthorization(["list","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to list parts",myName,6);
        return app.controllers[model].__get(searchObj);
      })
      .then(items => {
        req.appData.parts = items;
        req.appData.view = "parts";
        return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },
    get : function(req,res,next) {
      let myName = "get";
      let searchObj = {
        id : req.params.id
      }
      app.tools.checkAuthorization(["list","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to list parts",myName,6);
        return app.controllers[model].__get(searchObj);
      })
      .then(items => {
        req.appData.part = items[0];
        req.appData.view = "part";
        return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },
    update : function(req,res,next) {
      let myName = "editPart";
      return res.send("Not implemented");
    },
    delete : function(req,res,next) {
      let myName = "delete";
      app.log("Removing part: " + req.params.partId,myName,6);
      let searchObj = {
        id : req.params.id
      }
      app.tools.checkAuthorization(["delete","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to delete parts",myName,6);
        return app.controllers[model].__delete(searchObj);
      })
      .then(item => {
        return res.redirect("/parts/");
        // req.appData.part = item[0];
        // req.appData.view = "partedit";
        // return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },

    createForm : function(req,res,next) {
      let myName = "createForm";
      let item = {};
      item.domainId = req.session.user.currentDomain.id;
      item.userId = req.session.user.id;
      app.log("Invoking new part form for: " + JSON.stringify(item),myName,6,"::::>");
      req.appData.part = item;
      req.appData.view = "partcreate";
      return next();
    },
    updateForm : function(req,res,next) {
      let myName = "updateForm";
      let searchObj = {
        id : req.params.id
      }
      app.tools.checkAuthorization(["edit","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to edit parts",myName,6);
        return app.controllers[model].__get(searchObj);
      })
      .then(item => {
        req.appData.part = item[0];
        req.appData.view = "partedit";
        return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },
    deleteForm : function(req,res,next) {
      let myName = "deleteForm";
      return res.send("Not implemented");
    }
  };
  return obj;
};