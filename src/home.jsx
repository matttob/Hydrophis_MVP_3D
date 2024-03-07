

import { useState, useEffect, useRef} from 'react'
import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'
import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
import './app.css'
import { CustomSwitcher } from 'react-custom-switcher'
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import tileset_ids from './s3_tile_ids.js'
import geoJsonTranslateHeight from './translategeojsonheight.jsx'
import CustomSwitcheroptionsPrimary from './customswitcheroptionsprimary.jsx'
import useMousePosition from './usemouseposition'
//Cesium ion api access token
Ion.defaultAccessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYjM5M2JiYy03ODhiLTQ2YmUtODhkNC0yNTdlZTQ2Y2RkOGMiLCJpZCI6MTU4OTgxLCJpYXQiOjE2OTY0MzgyNjJ9.4DRtmcWO-nxpnuMP8hNoq8AYgyy3ZQYYfxuZQ_p0W1w";

// Bathymetry image provider details
const emodnet_provider = new WebMapServiceImageryProvider({
  url : 'https://ows.emodnet-bathymetry.eu/wms',
  layers :  'mean_multicolour',
  proxy: new DefaultProxy('/proxy/'),
  minimumLevel: '0',
});

// declare empty marker location variable 
var tileMarkerPositions =[]

// main homepage function
function Home() {

  const viewer_ref = useRef(null);

  const [viewerReady, setViewerReady] = useState(false)
  

  function computeTransform(latitude, longitude, height) {
    var offset = height;
    var cartesianOffset = Cartesian3.fromDegrees(longitude, latitude, offset);
    return Transforms.headingPitchRollToFixedFrame(cartesianOffset, new HeadingPitchRoll());
}



// Add custom terrain
  // const customTerrainProvider = new CesiumTerrainProvider({
  //       url:" http://localhost:8003/tileset.json"
  //     });
  

  useEffect(() => {
    setTimeout(() => {
    if (viewer_ref.current && viewer_ref.current.cesiumElement) {



        viewer_ref.current.cesiumElement._cesiumWidget._creditContainer.style.display = "none"
        viewer_ref.current.cesiumElement.animation.container.style.visibility = "hidden"
        viewer_ref.current.cesiumElement.timeline.container.style.visibility = "hidden"
        viewer_ref.current.cesiumElement._toolbar.style.visibility = "hidden"
        
       


        viewer_ref.current.cesiumElement.scene.backgroundColor = Color.BLACK.clone();
        viewer_ref.current.cesiumElement.scene.screenSpaceCameraController.enableCollisionDetection = false;

        // add custom terrain
        // viewer_ref.current.cesiumElement.scene.terrainProvider = customTerrainProvider
 
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
        });

        
       // finally show viewer when it has been available to ref  
        setViewerReady(true)
        
        // Event listener for scale bar
        viewer_ref.current.cesiumElement.camera.moveEnd.addEventListener(function() { 
          // the camera stopped moving
          updateDistanceScale()});
   // Event listener for mouse hover lon lat
          viewer_ref.current.cesiumElement.scene.canvas.addEventListener('mousemove', function(e) {
            updateHoverLonLat(e)})
            
  
    }}, 1); }, []);




   
    // Scale bar
    const [distanceScaleText, setDistanceScaleText] = useState("")
    const [scaleBarVisible, setScaleBarVisible] = useState(false)
    
    
    // create lonlat position text
    const [latText, setLatText] = useState("")
    const [lonText, setLonText] = useState("")
    const [latNorthSouth, setLatNorthSouth] = useState("")
    const [lonEastWest, setLonEastWest] = useState("")


  function updateHoverLonLat(e){

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
        
    }};

  

    function updateDistanceScale()
    {
    



      var geodesic = new EllipsoidGeodesic();
      var distances = [
          0.0001,
          0.001,
          0.01,
          0.1,
          1, 2, 3, 5,
          10, 20, 30, 50,
          100, 200, 300, 500,
          1000, 2000, 3000, 5000,
          10000, 20000, 30000, 50000];
        var scene = viewer_ref.current.cesiumElement.scene
       // Find the distance between two pixels at the bottom center of the screen.
       var width = scene.canvas.clientWidth;
       var height = scene.canvas.clientHeight;
  
       var left = scene.camera.getPickRay(new Cartesian2((width / 2) | 0, height - 1));
       var right = scene.camera.getPickRay(new Cartesian2(1 + (width / 2) | 0, height - 1));
   
       var globe = scene.globe;
       var leftPosition = globe.pick(left, scene);
       var rightPosition = globe.pick(right, scene);


      if (typeof leftPosition == "undefined" || typeof rightPosition == "undefined") {
        setDistanceScaleText("")
        setScaleBarVisible(false)
        return;
   }

   var leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
   var rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);

   geodesic.setEndPoints(leftCartographic, rightCartographic);
   var pixelDistance = geodesic.surfaceDistance  //meters to feet
   var pixelDistanceKm = pixelDistance / 1000;

   // Find the first distance that makes the scale bar less than 100 pixels.
   var maxBarWidth = 100;
   var distance;
   var label;
   var units;

   for (var i = distances.length - 1; i >= 0; --i) {
        if (distances[i] / pixelDistance < maxBarWidth) {
           if(distances[i] > 1000)
           {
               for (var j = distances.length - 1; j >= 0; --j)
               {
                   if (distances[j] / pixelDistanceKm < maxBarWidth)
                   {
                       distance = distances[j];
                       units = " km";
                       break;
                   }
                }
               break;
           }
           else
           {
               distance = distances[i];
               units = " m";
               break;
           }  
       }
   }
   
   if (typeof distance !== "undefined") {

       label = distance.toString() + units;
       setScaleBarVisible(true)

       if(units === " km")
       {
           document.getElementById("scalebar").style.width = ((distance / pixelDistanceKm) | 0).toString() + "px";
       }
       else
       {
           document.getElementById("scalebar").style.width = ((distance / pixelDistance) | 0).toString() + "px";
       }
   
       setDistanceScaleText(label)


   } else {
      setScaleBarVisible(false)
      
    }
    
    
    }


  const geoJsonReady = geo => {}

   
 const [tileMarkerAtt, setTileMarkerAtt] = useState([])

  const handleReady_tileset = tileset => {

  
    // match featureIdlabel from tileset to that of tileset object array in order to be able to apply tileset specfic attirbutes
    var verticalOffset
    const tileSetDetails = tileset_ids.map(tiles => {
      if (Object.values(tiles).includes(tileset.featureIdLabel)  ) {
        verticalOffset = -1*tiles.verticalOffset}
      })
    
      // Position the tileset
      var position = Matrix4.getTranslation(tileset._root.transform, new Cartesian3());
      var cartographicPosition = viewer_ref.current.cesiumElement.scene.globe.ellipsoid.cartesianToCartographic(position);
      tileset._root.transform = Matrix4.IDENTITY;
      tileset._root.transform = computeTransform(cartographicPosition.latitude/ CesiumMath.PI * 180, cartographicPosition.longitude/ CesiumMath.PI * 180, verticalOffset); // or set tileset._root.transform directly

     // add attributes to marker array
      var pos = {}
      const tileSetPosition = tileset_ids.map(tiles => {
    
        if (Object.values(tiles).includes(tileset.featureIdLabel)  ) {
        pos = {"name":tiles.name,
                    "cartoPosition" : position,
                    "longitude" : (cartographicPosition.longitude/ CesiumMath.PI * 180),
                    "latitude" : (cartographicPosition.latitude/ CesiumMath.PI * 180),
                    "markerType" : tiles.markerPath,
                    "id" : tiles.id,
                  "temporalGroupID" : tiles.temporalGroupID}}})
         
        tileMarkerPositions.push(pos)
        const key = 'id';
        const arrayUniqueByKey = [...new Map(tileMarkerPositions.map(item =>
          [item[key], item])).values()];
        
        setTileMarkerAtt(arrayUniqueByKey)
      
  };



  // control info slide out pane on model right click
  const [modelInfoText, setModelInfoText] = useState("")
  const [isModelInfo, setIsModelInfo] = useState({
    isModelInfoPaneOpen: false,
    isModelInfoPaneOpenLeft: false,
  });

  const handleModelRightClick = (mousePosIn) => {  
    setModelInfoText((viewer_ref.current.cesiumElement.scene.pick(mousePosIn.position).content._tileset.featureIdLabel))
    setIsModelInfo({ isModelPaneOpenLeft: true })

  };



    // control behaviour on model hover currently unused
    const [isHovering, setIsHovering] = useState(false)
    const handleHover = (mousePosIn) => {  
      setIsHovering(true)
  
    }
    function handleNoHover() {
      setIsHovering(false)
    }

//  check box for turning on or off bathymetry image layer 
 const [isChecked, setIsChecked] = useState(false)
 const Checkbox = () => {
  const checkHandler = () => {
      setIsChecked(!isChecked)}
    return (
      <div>
        <input
          type="checkbox"
          id="checkbox"
          checked={isChecked}
          onChange={checkHandler}
        />
        <label htmlFor="checkbox" style={{ color: 'white' , fontFamily: 'Inter'}}> Bathymetry </label>
      </div>
    )
  }
  

  // control info slide out pane on model right click
  const [markerInfoText, setMarkerInfoText] = useState("")
  const [isMarkerInfo, setIsMarkerInfo] = useState(false);


  // date slider state visibility based on 
  const [sliderYear, setSliderYear] = useState([2023])
  const [dateSliderContainerVis, setDateSliderContainerVis] = useState(false)


  // control behaviour on marker hover 
  const [isMarkerHovering, setIsMarkerHovering] = useState(false)

    function handleMarkerHover(mousePosIn) {  
      setIsMarkerHovering(true)
      setIsMarkerInfo(true)
      setMarkerInfoText((viewer_ref.current.cesiumElement.scene.pick(mousePosIn.endPosition).id._name))
    }
    function handleMarkerNoHover() {
      // setDateSliderContainerVis(true)
      setIsMarkerHovering(false)
      setIsMarkerInfo(false)
    }



// handle marker click
  function handleBillboardClick(mousePosIn) { 
    const findMarker = tileMarkerAtt.map(markers => {
    if (viewer_ref.current.cesiumElement.scene.pick(mousePosIn.position).id._name === markers.name)
      {
        if (markers.temporalGroupID.length  > 0 )   
        {setDateSliderContainerVis(true)}
      else {{setDateSliderContainerVis(false)} }}
    })
  }

  function handleMarkerRightClick(mousePosIn) {  
    setIsModelInfo({ isModelPaneOpenLeft: true })
    setModelInfoText((viewer_ref.current.cesiumElement.scene.pick(mousePosIn.position).id._name))
  }


  const markerElements = tileMarkerAtt.map(markers => {
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
  })

  let sliderShow 
  const tileSetElements = tileset_ids.map(tiles => {
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
  })

  const geoJsonElements = tileset_ids.map(geoJsons => {
    if (geoJsons.geojsonPath.length > 1)  {
    return  <GeoJsonDataSource data={geoJsonTranslateHeight(geoJsons.geojsonPath,geoJsons.geoJsonHeightAdjust)} 
    show = {sliderYear == geoJsons.year?  true : false}
    onLoad = {geoJsonReady}
    key={geoJsons.id}/> }
    else {
    
    }
  })


  return (
  <div >
      
    <div   id="cesiumContainer" className="fullSize" style={{visibility: viewerReady ? 'visible' : 'hidden' }}   >
      <Viewer full  skyBox = {false} infoBox={false} ref={viewer_ref}>
        <Scene>
          <ImageryLayer
            id = "bathy_imagery_layer"
            imageryProvider={emodnet_provider}
            magnificationFilter={TextureMagnificationFilter.LINEAR}
            alpha = {1}
            show = {isChecked? true : false}
          />
          {markerElements}
          {tileSetElements}
          {geoJsonElements}
        </Scene>
      </Viewer>

      <div id="scale-box" className = "scale-box" style={{visibility: scaleBarVisible  ? 'visible' : 'hidden' }}>
        <div id="scalebar" className="scalebar" > </div>
        <p id="scalebartag" className = "scalebartag">{distanceScaleText}</p>
      </div>
            
     {<div id="lonlat-box" className = "lonlat-box" style={{visibility: scaleBarVisible  ? 'visible' : 'hidden' }}>
        <p id="lonlat-box-text" className = "lonlat-box-text">{Math.abs(lonText)}&#xb0; {lonEastWest}  {Math.abs(latText)}&#xb0; {latNorthSouth}</p>
    </div>}

    <div className="bathy-checkBox">
        <Checkbox/>
    </div>

      {dateSliderContainerVis && <div className='date-slider-container'>
      <CustomSwitcher
        className="date-slider"
        options={CustomSwitcheroptionsPrimary}
          // value={2023}
        containerWidth={200}
        callback={(currentValue) => setSliderYear(currentValue)}> 
      </CustomSwitcher>
      </div>}

     

    <SlidingPane className =  "model-sliding-pane"
      // closeIcon={<div>Some div containing custom close icon.</div>}
      isOpen={isModelInfo.isModelPaneOpenLeft}
      title="Survey Meta Data"
      from="left"
      width="500px"
      onRequestClose={() => setIsModelInfo({isModelPaneOpenLeft: false })}>
      <div  >{modelInfoText}</div>
    </SlidingPane>



    <div className =  "marker-name-div" 
      style={{visibility: isMarkerInfo  ? 'visible' : 'hidden' ,
      position : 'absolute',
      left : `${JSON.stringify(useMousePosition().x+20)}px`,
      top : `${JSON.stringify(useMousePosition().y-20)}px`}}
      >
        {markerInfoText} 
      </div>
    </div>
 
  
   

    


      
      




</div>
  );
}

export default Home;
