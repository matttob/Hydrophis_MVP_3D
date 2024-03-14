import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
 import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'

 export default function createTileElements(tiles,sliderYear,handleReady_tileset,handleHover,handleNoHover,handleModelRightClick)

{
    let sliderShow 
    if (tiles.temporalGroupID.length  > 0 )   
      {if (sliderYear == tiles.year) {sliderShow = true}
      else {sliderShow = false}}
    else {sliderShow = true}
    return <Cesium3DTileset 
    key={tiles.id}
    featureIdLabel={tiles.description}
    url={tiles.url} 
    onReady={handleReady_tileset}
    onMouseEnter={handleHover}
    onMouseLeave={handleNoHover}
    onRightClick = {handleModelRightClick}
    show = {sliderShow}
    />
  }