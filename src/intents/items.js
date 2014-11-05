'use strict';
/*
 * ItemsIntent. Interprets raw user input and outputs model-friendly user
 * intents.
 */
var Rx = require('rx');
var replicate = require('mvi-example/utils/replicate');

var inputAddOneClicks$ = new Rx.Subject();
var inputAddManyClicks$ = new Rx.Subject();
var inputRemoveClicks$ = new Rx.Subject();
var inputItemColorChanged$ = new Rx.Subject();
var inputItemWidthChanged$ = new Rx.Subject();

function observe(ItemsView) {
  replicate(ItemsView.addOneClicks$, inputAddOneClicks$);
  replicate(ItemsView.addManyClicks$, inputAddManyClicks$);
  replicate(ItemsView.removeClicks$, inputRemoveClicks$);
  replicate(ItemsView.itemColorChanged$, inputItemColorChanged$);
  replicate(ItemsView.itemWidthChanged$, inputItemWidthChanged$);
}

var addItem$ = Rx.Observable.merge(
    inputAddOneClicks$.map(function () { return 1; }),
    inputAddManyClicks$.map(function () { return 1000; })
  );

var removeItem$ = inputRemoveClicks$.map(function (clickEvent) {
  return Number(clickEvent.currentTarget.attributes['data-item-id'].value);
});

var colorChanged$ = inputItemColorChanged$
  .map(function (inputEvent) {
    return {
      id: Number(inputEvent.currentTarget.attributes['data-item-id'].value),
      color: inputEvent.currentTarget.value
    };
  });

var widthChanged$ = inputItemWidthChanged$
  .map(function (inputEvent) {
    return {
      id: Number(inputEvent.currentTarget.attributes['data-item-id'].value),
      width: Number(inputEvent.currentTarget.value)
    };
  });

module.exports = {
  observe: observe,
  addItem$: addItem$,
  removeItem$: removeItem$,
  colorChanged$: colorChanged$,
  widthChanged$: widthChanged$
};
