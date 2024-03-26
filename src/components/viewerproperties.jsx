
import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'

 // set some viewer properties
export default function viewerProperties(viewer_ref)  {
 viewer_ref.current.cesiumElement._cesiumWidget._creditContainer.style.display = "none"
 viewer_ref.current.cesiumElement.animation.container.style.visibility = "hidden"
 viewer_ref.current.cesiumElement.timeline.container.style.visibility = "hidden"
 viewer_ref.current.cesiumElement._toolbar.style.visibility = "hidden"
 viewer_ref.current.cesiumElement.scene.backgroundColor = Color.BLACK.clone();
 viewer_ref.current.cesiumElement.scene.screenSpaceCameraController.enableCollisionDetection = false;
 // create core globe sphere and set transparency high at high zoom levels
 const outerCoreRadius = 6200000.0;
 const outerCore = viewer_ref.current.cesiumElement.entities.add({
   allowPicking: false,
   name: "test",
   position: Cartesian3.ZERO,
   ellipsoid: {
     radii: new Cartesian3(
       outerCoreRadius,
       outerCoreRadius,
       outerCoreRadius
     ),
     material: Color.BLACK,
   },
 });
 // define globe surface visibility properites in order for photogrametry models to appear through surface at certain zoom level
 const globe = viewer_ref.current.cesiumElement.scene.globe;
 globe._translucency._frontFaceAlphaByDistance = new NearFarScalar(
   100.0,
   0.0,
   800.0,
   1.0
 );
 globe._translucency._enabled = true
 globe._translucency._frontFaceAlphaByDistance._nearValue = 1;
 globe._translucency._frontFaceAlphaByDistance._farValue = true
 
// Position camera
 viewer_ref.current.cesiumElement.camera.flyTo({
   destination: Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
 })
}