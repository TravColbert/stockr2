const express = require('express');
var router = express.Router();

module.exports = function(app) {
  router.get('/',app.tools.checkAuthentication,app.controllers["parts"].gets);
  router.get('/:id/',app.tools.checkAuthentication,app.controllers["parts"].get);
  router.post('/',app.tools.checkAuthentication,app.controllers["parts"].create);
  router.post('/:id/',app.tools.checkAuthentication,app.controllers["parts"].update);
  return router;
};
