import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
 import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'

export default function createGeojsonElementsGems(geoJsonsUrl)

{

  
  async function geoJsonGet () {
    let mygeojson = {"type": "FeatureCollection", "features": []}
    await fetch(geoJsonsUrl)
   .then(response => response.json())
   .then(data => {
     for(let point of data.features){
       let properties = point;
       delete properties.longitude;
       delete properties.latitude;          
       let feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": point.geometry.coordinates}, "properties": properties}
       mygeojson.features.push(feature);
     }
     mygeojson.crs =  {
      "type": "name",
      "properties": {
        "name": "EPSG:4326"
        }
      }
   })
 
   return mygeojson
  
 }

      return  <GeoJsonDataSource data={geoJsonGet(geoJsonsUrl)} 
      markerSymbol = 'circle'
      key={'test123'}/> 

    }

    