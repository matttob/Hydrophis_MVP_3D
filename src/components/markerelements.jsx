 
 import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
 import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'

 export default function createMarkerElements(markers,handleBillboardClick,handleMarkerRightClick,handleMarkerHover,handleMarkerNoHover)
{
    return <Entity 
    key={markers.id}
    position={Cartesian3.fromDegrees(markers.longitude, markers.latitude,0)} 
    name={markers.name}
    onClick = {handleBillboardClick}
    onRightClick = {handleMarkerRightClick}
    onMouseEnter={handleMarkerHover}
    onMouseLeave={handleMarkerNoHover}
    >
 

    <BillboardGraphics 
    image={markers.markerType} 
    scale={0.03} 
    // disableDepthTestDistance={Number.POSITIVE_INFINITY}
    disableDepthTestDistance={10000000}

    color ={ new Color(1.0, 1.0, 1.0, 1)}
  />
  </Entity>
  }