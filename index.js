#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const tileReduce = require('@mapbox/tile-reduce');
const path = require('path');

tileReduce({
  bbox: argv.bbox,
  zoom: 15,
  map: path.join(__dirname, '/map.js'),
  mapOptions: {
    threshold: argv.threshold
  },
  sourceCover: 'ml',
  sources: [
    {
      name: 'pop',
      mbtiles: argv._[0],
      raw: false
    },
    {
      name: 'ml',
      mbtiles: argv._[1],
      raw: false
    }
  ]
})
  .on('reduce', function() {})
  .on('end', function() {});
