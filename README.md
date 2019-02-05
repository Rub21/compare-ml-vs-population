# Compare Machine Learning outputs VS Population Layer

This a script to compare the Machine learning dataset prediction output and the Population layer obtained from OpenStreetMap.

for obtaining, the population layer go to this repository: https://github.com/Rub21/osm-population-tiles

## Install

```

git clone https://github.com/Rub21/compare-ml-vs-population.git
cd compare-ml-vs-population/
npm install
npm link

```

## Usage


You should convert the Ml output into Mbtiles in a certain zoom and also the population layer should be in Mbtiles in the same zoom.

```
compareml population-zoom15.mbtiles ml-ouput-zoom15.mbtiles --threshold=0.92  >  ouput.json
docker run --rm -v ${PWD}:/mnt/data developmentseed/geokit:latest geokit jsonlines2geojson ouput.json > ouput.geojson
```
