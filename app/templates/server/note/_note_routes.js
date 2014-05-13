"use strict";

var controller = require('./note_controllers.js');

module.exports = exports = function (router) {
  router.param('note', controller.param);

  router.route('/')
    .get(controller.get)
    .post(controller.post);

  router.route('/:note')
    .delete(controller.destroy)
    .put(controller.update);
};