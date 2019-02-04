'use strict';

const turf = require('@turf/turf');
const _ = require('underscore');
var rbush = require('rbush');

module.exports = function (tileLayers, tile, writeData, done) {
  let mlBboxes = [];
  let popBboxes = [];
  const mlLayer = tileLayers.ml.ml;
  let mlFeatures = {}
  /** 
   * Set the variables here
    */
  const threshold = 0.92;

  for (let i = 0; i < mlLayer.features.length; i++) {
    const mlFeature = mlLayer.features[i];
    if (mlFeature.properties.p1 >= threshold) {
      const mlId = `m${i}`;
      mlFeatures[mlId] = mlFeature;
    }
  }

  writeData(JSON.stringify(turf.featureCollection(_.values(mlFeatures))) + '\n');


  // for (let d = 0; d < populationLayer.features.length; d++) {
  //   const popFeature = populationLayer.features[d];
  //   const popId = `p${d}`;
  //   popBboxes.push(objBbox(popFeature, popId));
  // }

  // const bboxes = [].concat(mlBboxes).concat(popBboxes);
  // const tree = rbush(bboxes.length);
  // tree.load(bboxes);
  // let results = {}

  // for (let z = 0; z < popBboxes.length; z++) {
  //   const bbox = popBboxes[z];
  //   var overlaps = tree.search(bbox);
  //   writeData(JSON.stringify(overlaps) + '\n')

  //   for (var k = 0; k < overlaps.length; k++) {
  //     const overlap = overlaps[k];
  //     // writeData(JSON.stringify(overlap) + '\n')
  //     // if (bbox.id !== overlap.id && overlap.id.charAt(0) === 'm') {
  //     //   results[overlap.id] = mlFeatures[overlap.id];
  //     // }
  //   }
  // }
  // const results = _.values(mlFeatures);
  // if (results.length > 0) {
  // writeData(JSON.stringify(turf.featureCollection(results)) + '\n');
  // writeData(JSON.stringify(popLayer) + '\n');

  // }
  done(null, null);
};

function objBbox(obj, id) {
  const bboxExtent = ['minX', 'minY', 'maxX', 'maxY'];
  let bbox = { id };
  const centroid = turf.centroid(obj);
  // console.log(centroid.geometry.coordiantes)
  const valBbox = turf.bbox(turf.centroid(obj));

  for (var d = 0; d < valBbox.length; d++) {
    bbox[bboxExtent[d]] = valBbox[d];
  }
  return bbox;
}


