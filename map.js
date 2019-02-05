'use strict';

const turf = require('@turf/turf');
const _ = require('underscore');
const rbush = require('rbush');

module.exports = function(tileLayers, tile, writeData, done) {
  let mlBboxes = [];
  let popBboxes = [];
  const mlLayer = tileLayers.ml.ml;
  const populationLayer = tileLayers.pop.pop;
  let mlFeatures = {};
  /**
   * Set the variables for filtering here!
   */
  /**
   * threshold, for filtering the data.
   */
  const threshold = global.mapOptions.threshold;

  /**
   * To filter the tiles which has the distance in this case greater than 0.
   */
  const distance = 0;

  for (let i = 0; i < mlLayer.features.length; i++) {
    const mlFeature = mlLayer.features[i];
    if (mlFeature.properties.p1 >= threshold) {
      const mlId = `m${i}`;
      mlFeatures[mlId] = mlFeature;
      mlBboxes.push(objBbox(mlFeature, mlId));
    }
  }

  for (let d = 0; d < populationLayer.features.length; d++) {
    const popFeature = populationLayer.features[d];
    if (popFeature.properties.distance > distance) {
      const popId = `p${d}`;
      popBboxes.push(objBbox(popFeature, popId));
    }
  }

  const bboxes = [].concat(mlBboxes).concat(popBboxes);
  const tree = rbush(bboxes.length);
  tree.load(bboxes);
  let results = {};
  for (let z = 0; z < popBboxes.length; z++) {
    const bbox = popBboxes[z];
    const overlaps = tree.search(bbox);
    for (let k = 0; k < overlaps.length; k++) {
      const overlap = overlaps[k];
      if (bbox.id !== overlap.id && overlap.id.charAt(0) === 'm') {
        results[overlap.id] = mlFeatures[overlap.id];
      }
    }
  }

  results = _.values(results);
  if (results.length > 0) {
    writeData(JSON.stringify(turf.featureCollection(results)) + '\n');
  }
  done(null, null);
};

function objBbox(obj, id) {
  const bboxExtent = ['minX', 'minY', 'maxX', 'maxY'];
  let bbox = { id };
  const valBbox = turf.bbox(obj);
  for (let d = 0; d < valBbox.length; d++) {
    bbox[bboxExtent[d]] = valBbox[d];
  }
  return bbox;
}
