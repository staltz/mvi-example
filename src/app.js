'use strict';
var binder = require('mvi-example/utils/binder');
var renderer = require('mvi-example/renderer');
var ItemsModel = require('mvi-example/models/items');
var ItemsView = require('mvi-example/views/items');
var ItemsIntent = require('mvi-example/intents/items');

window.onload = function () {
  binder(ItemsModel, ItemsView, ItemsIntent);
  renderer.init();
};
