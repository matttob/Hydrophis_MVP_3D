import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
 import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'

 import * as turf from '@turf/turf'
export default function createGeojsonElements(geoJsons,sliderYear)
{

  // add depth co-ordinate of zero if not present 

  

// adjust height of supplemenaty data loaded via geoJson
async function geoJsonTranslateHeight(geoJsonPath,heightAdjust) {
    var info = await fetch(geoJsonPath)
    .then(res => {
    return res.json()
    }).then(data => {
    return data
    })

    return turf.transformTranslate(info, 0, 0, {zTranslation: heightAdjust});
  }
    
    if (geoJsons.geojsonPath.length > 2)  {
      console.log(geoJsons.geojsonProps.strokeColour)
      return  <GeoJsonDataSource data={geoJsonTranslateHeight(geoJsons.geojsonPath,geoJsons.geoJsonHeightAdjust)} 
    show = {sliderYear == geoJsons.year?  true : false}
    key={geoJsons.id}
    // stroke = {Color[geoJsons.geojsonProps.strokeColour]}
    // fill =  {Color[geoJsons.geojsonProps.fillColour].withAlpha(geoJsons.geojsonProps.alpha)}
    stroke = {Color.RED}
    fill =  {Color.RED.withAlpha(0.1)}
    strokeWidth = {'10'}
 
    /> 
    }
    else {
    }
  }