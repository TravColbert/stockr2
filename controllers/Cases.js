module.exports = function(app,model) {
  if(!model) return false;
  let myName = model + "Controller";
  let myModel = model;
  let requiredFields = ["name"];
  let optionalFields = ["description","notes","userId","domainId"];
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

    getParts : function(caseId) {
      let myName = "getParts";
      app.log("Getting parts for case ID: " + caseId,myName,6);
      app.controllers[model].__get({ id:caseId })
      .then(cases => {
        return cases[0].getParts();
      })
      .then(parts => {
        app.log("Parts attached to case ID: " + caseId + " : " + parts.length,myName,6);
        return parts;
      })
      .catch(err => {
        return new Error("(" + myName + "): " + err.message);
      })
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
        app.log("User is authorized to create cases",myName,6);
        return app.controllers[model].__create(newItem);
      })
      .then(item => {
        req.appData.part = item;
        req.appData.view = "case";
        return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },
    gets : function(req,res,next) {
      let myName = "gets";
      let searchObj = {
        domainId : req.session.user.currentDomain.id
      }
      app.tools.checkAuthorization(["list","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to list cases",myName,6);
        return app.controllers[model].__get(searchObj);
      })
      .then(items => {
        req.appData.parts = items;
        req.appData.view = "cases";
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
        app.log("User is authorized to list cases",myName,6);
        return app.controllers[model].__get(searchObj);
      })
      .then(items => {
        req.appData.part = items[0];
        req.appData.view = "case";
        return next();
      })
      .catch(err => {
        return res.send("Err: " + err.message);
      });
    },
    update : function(req,res,next) {
      let myName = "update";
      return res.send("Not implemented");
    },
    delete : function(req,res,next) {
      let myName = "delete";
      app.log("Removing case: " + req.params.partId,myName,6);
      let searchObj = {
        id : req.params.id
      }
      app.tools.checkAuthorization(["delete","all"],req.session.user.id,req.session.user.currentDomain.id)
      .then(response => {
        if(!response) {
          app.log("User failed authorization check",myName,6);
          return next();
        }
        app.log("User is authorized to delete cases",myName,6);
        return app.controllers[model].__delete(searchObj);
      })
      .then(() => {
        return res.redirect("/cases/");
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
      app.log("Invoking new case form for: " + JSON.stringify(item),myName,6,"::::>");
      req.appData.case = item;
      req.appData.view = "casecreate";
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
        app.log("User is authorized to edit cases",myName,6);
        return app.controllers[model].__get(searchObj);
      })
      .then(item => {
        req.appData.case = item[0];
        req.appData.view = "caseedit";
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