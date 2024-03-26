import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
 import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2,PointPrimitiveCollection,PointGraphics} from 'cesium'
import { points } from '@turf/turf';

export default function createPointsGems(points,GEMSwfsUrlPoints)

{
   async function wfsGet () {

    await fetch(GEMSwfsUrlPoints)
   .then(response => response.json())
   .then(data => {
     for(let point of data.features){
       point.geometry.coordinates[2] = 5
       points.add({
        position : Cartesian3.fromDegrees(point.geometry.coordinates[0], point.geometry.coordinates[1],point.geometry.coordinates[2]),
        color : Color.CYAN,
       
    })}
   })
   
  
    
  }


if (points)
 { wfsGet ()} 
  

  }

