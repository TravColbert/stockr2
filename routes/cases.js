const express = require('express');
var router = express.Router();

module.exports = function(app) {
  router.get('/',app.tools.checkAuthentication,app.controllers["cases"].gets);
  router.get('/:id/',app.tools.checkAuthentication,app.controllers["cases"].get);
  router.post('/',app.tools.checkAuthentication,app.controllers["cases"].create);
  router.post('/:id/',app.tools.checkAuthentication,app.controllers["cases"].update);
  return router;
};
