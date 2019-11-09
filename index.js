'use strict';

const faker = require('faker');
const { createSelector } = require('reselect');
const Benchmark = require('benchmark');

const baseCategorySelector = ({ category }) => category;
const contentModeSelector = ({ contentMode }) => contentMode;
const categorySelector = createSelector(
  (state) => state,
  ({ category, contentMode }) => {
    if (!contentMode) {
      return category;
    }
    const { currentMode } = contentMode.map;
    return currentMode ? contentMode[currentMode] : category;
  }
);
const categorySelector2 = createSelector(
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
      if (key2 === 'map') {
        state[key1][state[key1][key2].currentMode] = size;
      }
    }
  }
  return state;
}


const state10 = createState(10);
const state100 = createState(100);
const state1000 = createState(1000);

console.log(pureCategorySelector(state10), pureCategorySelector(state10) === categorySelector(state10))
console.log(pureCategorySelector(state100), pureCategorySelector(state100) === categorySelector(state100))
console.log(pureCategorySelector(state1000), pureCategorySelector(state1000) === categorySelector(state1000))

const suite = new Benchmark.Suite();

// add tests
suite
  .add('create selector          ', function() {
    createSelector(
      baseCategorySelector,
      contentModeSelector,
      (category, contentMode) => {
        if (!contentMode) {
          return category;
        }
        const { currentMode } = contentMode.map;
        return currentMode ? contentMode[currentMode] : category;
      }
    )
  })
  .add('create selector  2       ', function() {
    const categorySelector = createSelector(
      (state) => state,
      ({ category, contentMode }) => {
        if (!contentMode) {
          return category;
        }
        const { currentMode } = contentMode.map;
        return currentMode ? contentMode[currentMode] : category;
      }
    );
  })
  .add('create pure selector     ', function() {
    const pureCategorySelector = ({ category, contentMode }) => {
      if (!contentMode) {
        return category;
      }
      const { currentMode } = contentMode.map;
      return currentMode ? contentMode[currentMode] : category;
    };
  })
  .add('reslect             10*10', function() {
    categorySelector(state10);
  })
  .add('reslect 2           10*10', function() {
    categorySelector2(state10);
  })
  .add('pure selector       10*10', function() {
    pureCategorySelector(state10);
  })
  .add('reslect           100*100', function() {
    categorySelector(state10);
  })
  .add('reslect   2       100*100', function() {
    categorySelector2(state10);
  })
  .add('pure selector     100*100', function() {
    pureCategorySelector(state10);
  })
  .add('reslect         1000*1000', function() {
    categorySelector(state10);
  })
  .add('reslect    2    1000*1000', function() {
    categorySelector2(state10);
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
