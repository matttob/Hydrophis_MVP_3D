import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
 import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2,PointPrimitiveCollection} from 'cesium'

export default function createPointsGems(wfsUrl,viewer_ref)

{

var points =  viewer_ref.current.cesiumElement.scene.primitives.add(new PointPrimitiveCollection());

  async function wfsGet () {
    
    await fetch(wfsUrl)
   .then(response => response.json())
   .then(data => {
    console.log('testwfs')
     for(let point of data.features){
     console.log(point.geometry.coordinates)
       point.geometry.coordinates[2] = 5
       points.add({
        position : Cartesian3.fromDegrees(point.geometry.coordinates[0], point.geometry.coordinates[1],point.geometry.coordinates[2]),
        color : Color.CYAN
    })
    
     }

   })}
   
   wfsGet () 
  }

    

