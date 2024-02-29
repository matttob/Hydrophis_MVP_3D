import { useState, useEffect, useRef} from 'react'
import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'
import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
import './app.css'
import { CustomSwitcher } from 'react-custom-switcher'
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import tileset_ids from "./s3_tile_ids.js"
import * as turf from '@turf/turf'

// adjust height of supplemenaty data loaded via geoJson
async function geoJsonTranslateHeight(geoJsonPath,heightAdjust) {
  var info = await fetch(geoJsonPath)
  .then(res => {
  return res.json();
  }).then(data => {
  return data;
  });
  return turf.transformTranslate(info, 0, 0, { zTranslation: heightAdjust});
}

// Date slider options
var CustomSwitcheroptionsPrimary = []
 CustomSwitcheroptionsPrimary = [
  {
    label:  <div style={{ fontSize: 15,color: 'white', whiteSpace: "nowrap" ,fontFamily: 'Inter'}}>2018</div>,
    value: 2018,
    color: "#32a871"
  },
  {
    label: <div style={{ fontSize: 15,color: 'white', whiteSpace: "nowrap" ,fontFamily: 'Inter'}}>2019</div>,
    value: 2019,
    color: "#32a871"
  }];

// Bathymetry image provider details
const emodnet_provider = new WebMapServiceImageryProvider({
  url : 'https://ows.emodnet-bathymetry.eu/wms',
  layers :  'mean_multicolour',
  proxy: new DefaultProxy('/proxy/'),
  minimumLevel: '0',
});

// Get cursor position in screen coordinates 
function useMousePosition() {
  const [mousePosition,setMousePosition] = useState({ x: null, y: null })
  useEffect(() => {
    const updateMousePosition = ev => {setMousePosition({ x: ev.clientX, y: ev.clientY })}
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition}


// main page function
function Home() {
  const [viewerReady, setViewerReady] = useState(false)
  // UseEffect with timeout 'required' as Cesium viewer takes some time to be availabe and not return undefined. Even a 1ms timeout seems to be suffecient.
  const viewer_ref = useRef(null) 
    useEffect(() => {
      setTimeout(() => {
      // when viewer available, set some default properties of the Cesium
      if (viewer_ref.current && viewer_ref.current.cesiumElement) {
      viewer_ref.current.cesiumElement._cesiumWidget._creditContainer.style.display = "none"
      viewer_ref.current.cesiumElement.animation.container.style.visibility = "hidden"
      viewer_ref.current.cesiumElement.timeline.container.style.visibility = "hidden"
      viewer_ref.current.cesiumElement._toolbar.style.visibility = "hidden"
      viewer_ref.current.cesiumElement.scene.backgroundColor = Color.BLACK.clone()
      viewer_ref.current.cesiumElement.scene.screenSpaceCameraController.enableCollisionDetection = false
      // create core globe sphere and set transparency high at high zoom levels
      const outerCoreRadius = 6200000.0
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
      })
      // set properties related to how far away data beneath top map layer will be vivisble
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
      
      // set initial camera position
      viewer_ref.current.cesiumElement.camera.flyTo({
        destination: Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
      });

      // finally show viewer when it has been available to ref  
      setViewerReady(true)
          
      // Event listener for scale bar
      viewer_ref.current.cesiumElement.camera.moveEnd.addEventListener(function() {updateDistanceScale()});
      // Event listener for mouse hover lon lat
      viewer_ref.current.cesiumElement.scene.canvas.addEventListener('mousemove', function(e) {updateHoverLonLat(e)})   
      }}, 1); }, []);

    // Scale bar
    const [distanceScaleText, setDistanceScaleText] = useState("")
    const [scaleBarVisible, setScaleBarVisible] = useState(false)
    
    // create lonlat position text
    const [latText, setLatText] = useState("")
    const [lonText, setLonText] = useState("")
    const [latNorthSouth, setLatNorthSouth] = useState("")
    const [lonEastWest, setLonEastWest] = useState("")
    
    // These functions appear here as the access viewer_ref
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

    function updateDistanceScale(){
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
        return}

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

  // deal with individual tilesets once they have loaded
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
      var cartesianOffset = Cartesian3.fromDegrees(cartographicPosition.longitude/ CesiumMath.PI * 180, cartographicPosition.latitude/ CesiumMath.PI * 180, verticalOffset);
      tileset._root.transform =Transforms.headingPitchRollToFixedFrame(cartesianOffset, new HeadingPitchRoll()) // or set tileset._root.transform directly

     // add attributes to marker array that us then used to create billboard entities 
      var tileMarkerPositions =[]
      var pos = {}
      const tileSetPosition = tileset_ids.map(tiles => {
        if (Object.values(tiles).includes(tileset.featureIdLabel)) {
          pos = {"name":tiles.name,
                      "cartoPosition" : position,
                      "longitude" : (cartographicPosition.longitude/ CesiumMath.PI * 180),
                      "latitude" : (cartographicPosition.latitude/ CesiumMath.PI * 180),
                      "markerType" : tiles.markerPath,
                      "id" : tiles.id,
                    "temporalGroupID" : tiles.temporalGroupID}}
        })
        tileMarkerPositions.push(pos)
        const key = 'id';
        const arrayUniqueByKey = [...new Map(tileMarkerPositions.map(item =>
          [item[key], item])).values()];
        
        setTileMarkerAtt(arrayUniqueByKey)
      

      //// Test centre of rotation settings
      //   var transform = Transforms.eastNorthUpToFixedFrame(tileset._root._boundingVolume._boundingSphere.center);
      // var cartographicTransform = viewer_ref.current.cesiumElement.scene.globe.ellipsoid.cartesianToCartographic(transform);
      //   // transform = Matrix4.IDENTITY;
      //   // transform = computeTransform(cartographicTransform.latitude/ CesiumMath.PI * 180, cartographicTransform.longitude/ CesiumMath.PI * 180, verticalOffset); 
      //   transform[12] = transform[12] + tileset._root._boundingVolume._boundingSphere.radius
      //   transform[13] = transform[13]  + tileset._root._boundingVolume._boundingSphere.radius
      //   transform[14] = transform[14] - 20
      //   // View in east-north-up frame
      //   const camera = viewer_ref.current.cesiumElement.camera;
      //   camera.constrainedAxis = Cartesian3.UNIT_Z;
      //   camera.lookAtTransform(
      //     transform,
      //     new Cartesian3(-1200.0, -1200.0, -100)
      //   );
      //   // Show reference frame.  Not required.
      //   const referenceFramePrimitive = viewer_ref.current.cesiumElement.scene.primitives.add(
      //   new DebugModelMatrixPrimitive({
      //   modelMatrix: transform,
        // length: 100000.0}));
       
      
    // test clamp tiles to terrain
    //     //  let c3d_layers
    //     //  c3d_layers = viewer_ref.current.cesiumElement.scene.primitives._primitives.filter(pr => pr.constructor.name=='Cesium3DTileset')
    //     //  console.log(c3d_layers[0]._root._header.transform)
    //      var heightOffset = 20.0;
    //      var boundingSphere = tileset.boundingSphere;
    //      var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    //      var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    //       console.log(surface)
    //      var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
    //      var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    //      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    //  viewer_ref.current.cesiumElement.scene.clampToHeightMostDetailed(c3d_layers[0]._root._header.boundingVolume)
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
  
  // control info slide out pane on marker right click
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
    setIsMarkerInfo({ isMarkerPaneOpenLeft: true })
    setMarkerInfoText((viewer_ref.current.cesiumElement.scene.pick(mousePosIn.position).id._name))
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
        // disableDepthTestDistance={Number.POSITIVE_INFINITY} sets how far away markers are visible
        disableDepthTestDistance={10000000}
        color ={ new Color(1.0, 1.0, 1.0, 1)}
        />
    </Entity>
  })

  var sliderShow 
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
      show = {sliderShow}
      />
  })

  const geoJsonElements = tileset_ids.map(geoJsons => {
    if (geoJsons.geojsonPath.length > 1)  {
    return  <GeoJsonDataSource data={geoJsonTranslateHeight(geoJsons.geojsonPath,geoJsons.geoJsonHeightAdjust)} 
      show = {sliderYear == geoJsons.year?  true : false}
      key={geoJsons.id}/> }
    else {
    }
  })


  return (
  <div>   
    <div   id="cesiumContainer" class="fullSize" style={{visibility: viewerReady ? 'visible' : 'hidden' }}  >
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

    <SlidingPane className =  "marker-sliding-pane"
      // closeIcon={<div>Some div containing custom close icon.</div>}
      isOpen={isMarkerInfo.isMarkerPaneOpenLeft}
      title="Survey Meta Data"
      from="left"
      width="500px"
      onRequestClose={() => setIsMarkerInfo({isModelPaneOpenLeft: false })}>
      <div  >{markerInfoText}</div>
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



