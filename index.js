'use strict';

const faker = require('faker');
const { createSelector } = require('reselect');
const Benchmark = require('benchmark');

const baseCategorySelector = ({ category }) => category;
const contentModeSelector = ({ contentMode }) => contentMode;
const categorySelector = createSelector(
  baseCategorySelector,
  contentModeSelector,
  (category, contentMode) => {
    if (!contentMode) {
      return category;
    }
    const { currentMode } = contentMode.map;
    return currentMode ? contentMode[currentMode] : category;
  }
);

const pureCategorySelector = ({ category, contentMode }) => {
  if (!contentMode) {
    return category;
  }
  const { currentMode } = contentMode.map;
  return currentMode ? contentMode[currentMode] : category;
};

function createState(size) {
  const state = {};
  const categoryIndex = Math.floor(Math.random() * size);
  const contentModeIndex = Math.floor(Math.random() * size);

  for (let i = 0; i < size; i++) {
    const key1 = i === categoryIndex
      ? 'category'
      : i === contentModeIndex
        ? 'contentMode'
        : faker.name.findName();
    state[key1] = {};
    for (let j = 0; j < size; j++) {
      const key2 = i === contentModeIndex && j === contentModeIndex
        ? 'map'
        : faker.internet.email();
      state[key1][key2] = { currentMode: faker.address.streetAddress() };
    }
  }
  return state;
}

const state10 = createState(10);
const state100 = createState(100);
const state1000 = createState(1000);

const suite = new Benchmark.Suite();

// add tests
suite
  .add('reslect             10*10', function() {
    categorySelector(state10);
  })
  .add('pure selector       10*10', function() {
    pureCategorySelector(state10);
  })
  .add('reslect           100*100', function() {
    categorySelector(state10);
  })
  .add('pure selector     100*100', function() {
    pureCategorySelector(state10);
  })
  .add('reslect         1000*1000', function() {
    categorySelector(state10);
  })
  .add('pure selector   1000*1000', function() {
    pureCategorySelector(state10);
  })
// add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
// run async
  .run({ async: true });
