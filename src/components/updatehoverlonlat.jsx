import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'


   // Event listener for mouse hover lon lat

export default function  updateHoverLonLat(viewer_ref,setLatText,setLonText,setLatNorthSouth,setLonEastWest)
{ viewer_ref.current.cesiumElement.scene.canvas.addEventListener('mousemove', function(e)  {

    var ellipsoid =  viewer_ref.current.cesiumElement.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position 
    var cartesian = viewer_ref.current.cesiumElement.camera.pickEllipsoid(new Cartesian3(e.clientX, e.clientY), ellipsoid);
    if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = CesiumMath.toDegrees(cartographic.longitude).toFixed(5);
        var latitudeString = CesiumMath.toDegrees(cartographic.latitude).toFixed(5);
        setLonText(longitudeString)
        longitudeString > 0 ? setLonEastWest('W') : setLonEastWest('E');
        setLatText(latitudeString)   
        latitudeString > 0 ? setLatNorthSouth('N') : setLatNorthSouth('S');
       
        
    }
})};