'use strict';

const faker = require('faker');
const { createSelector } = require('reselect');
const Benchmark = require('benchmark');
let originalState = {};
try {
  const state = require('./state');
  originalState = state;
} catch (error) {
  console.log('You have no original state, but it doesn\'t matter');
}

const CONTENT_MODES = {
  movies: 'movies',
  series: 'series',
};

const baseCategorySelector = ({ category }) => category;
const contentModeSelector = ({ contentMode }) => contentMode;
const categorySelector = createSelector(
  state => state,
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

const allCatChildrenIdMapsSelector = createSelector(
  baseCategorySelector,
  contentModeSelector,
  (category, contentMode) => {
    if (!contentMode) {
      return [ category ];
    }
    return [
      category.catChildrenIdMap,
      contentMode[CONTENT_MODES.movies].catChildrenIdMap,
      contentMode[CONTENT_MODES.series].catChildrenIdMap,
    ];
  }
);

const allCatChildrenIdMapsSelector2 = createSelector(
  state => state,
  ({ category, contentMode }) => {
    if (!contentMode) {
      return [ category ];
    }
    return [
      category.catChildrenIdMap,
      contentMode[CONTENT_MODES.movies].catChildrenIdMap,
      contentMode[CONTENT_MODES.series].catChildrenIdMap,
    ];
  }
);

const pureAllCatChildrenIdMapsSelector = ({ category, contentMode }) => {
  if (!contentMode) {
    return [ category ];
  }
  return [
    category.catChildrenIdMap,
    contentMode[CONTENT_MODES.movies].catChildrenIdMap,
    contentMode[CONTENT_MODES.series].catChildrenIdMap,
  ];
};

function createState(size) {
  const state = Object.assign({}, originalState);
  const hasContentMode = !!state.contentMode;
  const categoryIndex = hasContentMode ? -1 : Math.floor(Math.random() * size);
  const contentModeIndex = hasContentMode ? -1 : Math.floor(Math.random() * size);

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

console.log(pureCategorySelector(originalState) === categorySelector(originalState));
console.log(pureCategorySelector(originalState) === categorySelector2(originalState));
console.log(pureAllCatChildrenIdMapsSelector(originalState) === allCatChildrenIdMapsSelector(originalState));
console.log(pureAllCatChildrenIdMapsSelector(originalState) === allCatChildrenIdMapsSelector2(originalState));

const suite = new Benchmark.Suite();

// add tests
suite
  .add('create categorySelector                        ', function() {
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
    );
  })
  .add('create categorySelector  2                     ', function() {
    const categorySelector = createSelector(
      state => state,
      ({ category, contentMode }) => {
        if (!contentMode) {
          return category;
        }
        const { currentMode } = contentMode.map;
        return currentMode ? contentMode[currentMode] : category;
      }
    );
  })
  .add('create pure categorySelector                   ', function() {
    const pureCategorySelector = ({ category, contentMode }) => {
      if (!contentMode) {
        return category;
      }
      const { currentMode } = contentMode.map;
      return currentMode ? contentMode[currentMode] : category;
    };
  })
  .add('reslect categorySelector                       ', function() {
    categorySelector(originalState);
  })
  .add('reslect categorySelector2                      ', function() {
    categorySelector2(originalState);
  })
  .add('pure categorySelector                          ', function() {
    pureCategorySelector(originalState);
  })
  .add('reslect categorySelector                  10*10', function() {
    categorySelector(state10);
  })
  .add('reslect categorySelector2                 10*10', function() {
    categorySelector2(state10);
  })
  .add('pure categorySelector                     10*10', function() {
    pureCategorySelector(state10);
  })
  .add('reslect categorySelector                100*100', function() {
    categorySelector(state100);
  })
  .add('reslect categorySelector2               100*100', function() {
    categorySelector2(state100);
  })
  .add('pure categorySelector                   100*100', function() {
    pureCategorySelector(state100);
  })
  .add('reslect categorySelector              1000*1000', function() {
    categorySelector(state1000);
  })
  .add('reslect categorySelector2             1000*1000', function() {
    categorySelector2(state1000);
  })
  .add('pure categorySelector                 1000*1000', function() {
    pureCategorySelector(state1000);
  })

  .add('reslect allCatChildrenIdMapsSelector           ', function() {
    allCatChildrenIdMapsSelector(originalState);
  })
  .add('reslect allCatChildrenIdMapsSelector2          ', function() {
    allCatChildrenIdMapsSelector2(originalState);
  })
  .add('pure allCatChildrenIdMapsSelector              ', function() {
    pureAllCatChildrenIdMapsSelector(originalState);
  })
  .add('reslect allCatChildrenIdMapsSelector      10*10', function() {
    allCatChildrenIdMapsSelector(state10);
  })
  .add('reslect allCatChildrenIdMapsSelector2     10*10', function() {
    allCatChildrenIdMapsSelector2(state10);
  })
  .add('pure allCatChildrenIdMapsSelector         10*10', function() {
    pureAllCatChildrenIdMapsSelector(state10);
  })
  .add('reslect allCatChildrenIdMapsSelector    100*100', function() {
    allCatChildrenIdMapsSelector(state100);
  })
  .add('reslect allCatChildrenIdMapsSelector2   100*100', function() {
    allCatChildrenIdMapsSelector2(state100);
  })
  .add('pure allCatChildrenIdMapsSelector       100*100', function() {
    pureAllCatChildrenIdMapsSelector(state100);
  })
  .add('reslect allCatChildrenIdMapsSelector  1000*1000', function() {
    allCatChildrenIdMapsSelector(state1000);
  })
  .add('reslect allCatChildrenIdMapsSelector2 1000*1000', function() {
    allCatChildrenIdMapsSelector2(state1000);
  })
  .add('pure allCatChildrenIdMapsSelector     1000*1000', function() {
    pureAllCatChildrenIdMapsSelector(state1000);
  })
// add listeners
  .on('cycle', function(event) {
    const target = String(event.target);
    console.log(target);
    if (target.indexOf('pure') > -1) {
      console.log('---------------------------------------------------------------------------------')
    }
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
// run async
  .run({ async: true });
