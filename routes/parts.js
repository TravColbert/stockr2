const express = require('express');
var router = express.Router();

module.exports = function(app) {
  router.get('/:id/consumed/',app.tools.checkAuthentication,app.controllers["parts"].getConsumed);
  router.get('/:id/',app.tools.checkAuthentication,app.controllers["parts"].get);
  router.get('/',app.tools.checkAuthentication,app.controllers["parts"].gets);
  router.post('/:id/',app.tools.checkAuthentication,app.controllers["parts"].update);
  router.post('/',app.tools.checkAuthentication,app.controllers["parts"].create);
  return router;
};
