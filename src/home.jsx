import { useState, useEffect, useRef} from 'react'
import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'
import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
import './app.css'
import { CustomSwitcher } from 'react-custom-switcher'
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import tileset_ids from './s3_tile_ids.js'
import CustomSwitcheroptionsPrimary from './customswitcheroptionsprimary.jsx'
import useMousePosition from './usemouseposition'
import updateDistanceScale from './updatedistancescale.jsx'
import updateHoverLonLat from './updatehoverlonlat.jsx'
import viewerProperties from './viewerproperties.jsx'
import emodnet_provider from './bathymetryprovider.js'
import bathyCheckbox from './components/bathybox.jsx'
import createMarkerElements from './components/markerelements.jsx'
import createTileElements from './components/tilesets.jsx'
import createGeojsonElements from './components/geojsonpolygons.jsx'
import createGeojsonElementsGems from './components/geojsonpolygons_GEMS.jsx'
//Cesium ion api access token
Ion.defaultAccessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYjM5M2JiYy03ODhiLTQ2YmUtODhkNC0yNTdlZTQ2Y2RkOGMiLCJpZCI6MTU4OTgxLCJpYXQiOjE2OTY0MzgyNjJ9.4DRtmcWO-nxpnuMP8hNoq8AYgyy3ZQYYfxuZQ_p0W1w";

// declare empty marker location variable 
var tileMarkerPositions =[]

// main homepage function
function Home() {


  // define viewer variable
  const viewer_ref = useRef(null);
  // viewer available state
  const [viewerReady, setViewerReady] = useState(false)
  // Right now use effect and timeout (only 1ms seems to be required) used in order to wait for viewer_ref to be defined and thus available. Not the most elegant solution!
  useEffect(() => {
    setTimeout(() => {
    if (viewer_ref.current && viewer_ref.current.cesiumElement) {   
        // set some viewer properties
        viewerProperties(viewer_ref) 
       // finally show viewer when it has been available to ref  
        setViewerReady(true)
      }}, 1); }, []);

  // Event listener for scale bar
  const [distanceScaleText, setDistanceScaleText] = useState("")
  const [scaleBarVisible, setScaleBarVisible] = useState(false)
  if (viewerReady){(updateDistanceScale(viewer_ref,setDistanceScaleText,setScaleBarVisible))}
   
  // lonlat position text 
  const [latText, setLatText] = useState("")
  const [lonText, setLonText] = useState("")
  const [latNorthSouth, setLatNorthSouth] = useState("")
  const [lonEastWest, setLonEastWest] = useState("")
  if (viewerReady){updateHoverLonLat(viewer_ref,setLatText,setLonText,setLatNorthSouth,setLonEastWest)}
  
  //data set marker attribute state
  const [tileMarkerAtt, setTileMarkerAtt] = useState([])
  
 // Needs to be seperated but struggling with the complexity of abstracting all the required functions and variables along with abstracting the tileset elements
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
      tileset._root.transform = Transforms.headingPitchRollToFixedFrame(cartesianOffset, new HeadingPitchRoll())
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
  }

  // control info slide out pane on model right click
  const [modelInfoText, setModelInfoText] = useState("")
  const [isModelInfo, setIsModelInfo] = useState({
    isModelInfoPaneOpen: false,
    isModelInfoPaneOpenLeft: false,
  })
  const handleModelRightClick = (mousePosIn) => {  
    setModelInfoText((viewer_ref.current.cesiumElement.scene.pick(mousePosIn.position).content._tileset.featureIdLabel))
    setIsModelInfo({ isModelPaneOpenLeft: true })
  }

  // control behaviour on model hover currently unused
    const [isHovering, setIsHovering] = useState(false)
    const handleHover = (mousePosIn) => {  
      setIsHovering(true)
    }
    function handleNoHover() {
      setIsHovering(false)
    }

  //  check box state for turning on or off bathymetry image layer 
  const [isChecked, setIsChecked] = useState(false)

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

  // Create marker components
  const markerElements = tileMarkerAtt.map(markers => createMarkerElements(markers,handleBillboardClick,handleMarkerRightClick,handleMarkerHover,handleMarkerNoHover))
  // Create 3d tile elements
  const tileSetElements = tileset_ids.map(tiles => createTileElements(tiles,sliderYear,handleReady_tileset,handleHover,handleNoHover,handleModelRightClick))
   // Create gejoson elements
  const geoJsonElements = tileset_ids.map(geoJsons => createGeojsonElements(geoJsons,sliderYear))
   // Create GEMS gejoson elements
  const geoJsonElementsGems = createGeojsonElementsGems('https://ogc.nature.scot/geoserver/gems/wfs??SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&typeName=gems:maerl_beds_points&cql_filter=YEAR=%271998%27&outputFormat=application/json')

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
          {viewerReady && markerElements}
          {viewerReady && tileSetElements}
          {viewerReady && geoJsonElements}
          {/* {viewerReady && geoJsonElementsGems} */}
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
      {bathyCheckbox(isChecked,setIsChecked)}
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
