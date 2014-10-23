'use strict';
/*
 * ItemsModel.
 * As output, Observable of array of item data.
 * As input, ItemsIntent.
 */
var Rx = require('rx');
var replicate = require('mvi-example/utils/replicate');

var intentAddItem$ = new Rx.Subject();
var intentRemoveItem$ = new Rx.Subject();
var intentWidthChanged$ = new Rx.Subject();
var intentColorChanged$ = new Rx.Subject();

function observe(ItemsIntent) {
  replicate(ItemsIntent.addItem$, intentAddItem$);
  replicate(ItemsIntent.removeItem$, intentRemoveItem$);
  replicate(ItemsIntent.widthChanged$, intentWidthChanged$);
  replicate(ItemsIntent.colorChanged$, intentColorChanged$);
}

function createRandomItem() {
  var hexColor = Math.floor(Math.random() * 16777215).toString(16);
  while (hexColor.length < 6) {
    hexColor = '0' + hexColor;
  }
  hexColor = '#' + hexColor;
  var randomWidth = Math.floor(Math.random() * 800 + 200);
  return {color: hexColor, width: randomWidth};
}

function reassignId(item, index) {
  return {id: index, color: item.color, width: item.width};
}

var items$ = Rx.Observable.just([{id: 0, color: 'red', width: 300}])
  .merge(intentAddItem$)
  .merge(intentRemoveItem$)
  .merge(intentColorChanged$)
  .merge(intentWidthChanged$)
  .scan(function (listItems, x) {
    if (Array.isArray(x)) {
      return x;
    }
    else if (x.operation === 'add') {
      var newItems = [];
      for (var i = 0; i < x.amount; i++) {
        newItems.push(createRandomItem());
      }
      return listItems.concat(newItems).map(reassignId);
    }
    else if (x.operation === 'remove') {
      return listItems
        .filter(function (item) { return item.id !== x.id; })
        .map(reassignId);
    }
    else if (x.operation === 'changeColor') {
      return listItems
        .map(function (item) {
          if (item.id === x.id) { return {color: x.color, width: item.width}; }
          else { return item; }
        })
        .map(reassignId);
    }
    else if (x.operation === 'changeWidth') {
      return listItems
        .map(function (item) {
          if (item.id === x.id) { return {color: item.color, width: x.width}; }
          else { return item; }
        })
        .map(reassignId);
    }
    else {
      return listItems;
    }
  });

module.exports = {
  observe: observe,
  items$: items$
};
