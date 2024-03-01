import * as turf from '@turf/turf'
// adjust height of supplemenaty data loaded via geoJson
async function geoJsonTranslateHeight(geoJsonPath,heightAdjust) {
    var info = await fetch(geoJsonPath)
    .then(res => {
    return res.json();
    }).then(data => {
    return data;
    });
    return turf.transformTranslate(info, 0, 0, {zTranslation: heightAdjust});
  }
  

  export default geoJsonTranslateHeight;



