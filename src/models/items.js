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

var addItemMod$ = intentAddItem$.map(function(amount) {
  var newItems = [];
  for (var i = 0; i < amount; i++) {
    newItems.push(createRandomItem());
  }
  return function(listItems) {
    return listItems.concat(newItems).map(reassignId);
  };
});

var removeItemMod$ = intentRemoveItem$.map(function (id) {
  return function(listItems) {
    return listItems.filter(function (item) { return item.id !== id; })
                    .map(reassignId);
  };
});

var colorChangedMod$ = intentColorChanged$.map(function(x) {
  return function(listItems) {
    listItems[x.id].color = x.color;
    return listItems;
  };
});

var widthChangedMod$ = intentWidthChanged$.map(function (x) {
  return function(listItems) {
    listItems[x.id].width = x.width;
    return listItems;
  };
});

var itemModifications = addItemMod$.merge(removeItemMod$).merge(colorChangedMod$).merge(widthChangedMod$);

var items$ = itemModifications.startWith(
  [{id: 0, color: 'red', width: 300}]
).scan(function(listItems, modification) {
  return modification(listItems);
});

module.exports = {
  observe: observe,
  items$: items$
};
