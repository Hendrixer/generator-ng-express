"use strict";

var Note = require('./note_model.js'),
    Q    = require('q');

module.exports = exports = {
  get: function (req, res, next) {
    var $promise = Q.nbind(Note.find, Note);
    $promise()
      .then(function (notes) {
        res.json(notes);
      })
       .fail(function (reason) {
        next(reason);
      });
  },

  post: function (req, res, next) {
    var note = req.body.note;
    var $promise = Q.nbind(Note.create, Note);
    $promise(note)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  },

  destroy: function (req, res, next) {
    var id = req.note._id;
    var $promise = Q.nbind(Note.findByIdAndRemove, Note);

    $promise(id)
      .then(function (id) {
        res.send(id);
      })
        .fail(function (reason) {
        next(reason);
      });
  },

  update: function (req, res, next) {
    var id = req.note._id;
    var changes = req.body.note;
    var $promise = Q.nbind(Note.findByIdAndUpdate, Note);

    $promise(id, changes)
      .then(function (note) {
        res.send(note._id);
      })
      .fail(function (reason) {
        next(reason);
      });
  },

  param: function (req, res, next, id) {
    var $promise = Q.nbind(Note.findById, Note);

    $promise(id).then(function (note) {
      req.note = note;
      next();
    })
    .fail(function (reason) {
      next(reason);
    });
  }
};