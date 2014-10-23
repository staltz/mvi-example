'use strict';
/*
 * ItemsView.
 * As output, Observable of vtree (Virtual DOM tree).
 * As input, ItemsModel.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var replicate = require('mvi-example/utils/replicate');

var modelItems$ = new Rx.BehaviorSubject(null);
var itemWidthChanged$ = new Rx.Subject();
var itemColorChanged$ = new Rx.Subject();
var removeClicks$ = new Rx.Subject();
var addOneClicks$ = new Rx.Subject();
var addManyClicks$ = new Rx.Subject();

function observe(ItemsModel) {
  replicate(ItemsModel.items$, modelItems$);
}

function vrenderTopButtons() {
  return h('div.topButtons', {}, [
    h('button',
      {'ev-click': function (ev) { addOneClicks$.onNext(ev); }},
      'Add New Item'
    ),
    h('button',
      {'ev-click': function (ev) { addManyClicks$.onNext(ev); }},
      'Add Many Items'
    )
  ]);
}

function vrenderItem(itemData) {
  return h('div', {
    style: {
      'border': '1px solid #000',
      'background': 'none repeat scroll 0% 0% ' + itemData.color,
      'width': itemData.width + 'px',
      'height': '70px',
      'display': 'block',
      'padding': '20px',
      'margin': '10px 0px'
    }}, [
      h('input', {
        type: 'text', value: itemData.color,
        'attributes': {'data-item-id': itemData.id},
        'ev-input': function (ev) { itemColorChanged$.onNext(ev); }
      }),
      h('div', [
        h('input', {
          type: 'range', min:'200', max:'1000', value: itemData.width,
          'attributes': {'data-item-id': itemData.id},
          'ev-input': function (ev) { itemWidthChanged$.onNext(ev); }
        })
      ]),
      h('div', String(itemData.width)),
      h('button', {
        'attributes': {'data-item-id': itemData.id},
        'ev-click': function (ev) { removeClicks$.onNext(ev); }
      }, 'Remove')
    ]
  );
}

var vtree$ = modelItems$
  .map(function (itemsData) {
    return h('div.everything', {}, [
      vrenderTopButtons(),
      itemsData.map(vrenderItem)
    ]);
  });

module.exports = {
  observe: observe,
  vtree$: vtree$,
  removeClicks$: removeClicks$,
  addOneClicks$: addOneClicks$,
  addManyClicks$: addManyClicks$,
  itemColorChanged$: itemColorChanged$,
  itemWidthChanged$: itemWidthChanged$
};
