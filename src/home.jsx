

import { useState, useEffect, useRef} from 'react'

import {Math,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive} from 'cesium'
import { Viewer,Scene, Entity , GeoJsonDataSource, KmlDataSource,CameraFlyTo, Cesium3DTileset, ScreenSpaceEventHandler,PointGraphics,EntityDescription ,BillboardGraphics,ImageryLayer,useCesium} from 'resium'
import './app.css'
import { CustomSwitcher } from 'react-custom-switcher'
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import tileset_ids from "./s3_tile_ids.js"
import * as turf from '@turf/turf'




// // Deal with test geojson file
async function geoJsonTranslateHeight(geoJsonPath,heightAdjust) {
  var info = await fetch(geoJsonPath)
  .then(res => {
  return res.json();
  }).then(data => {
  return data;
  });
  return turf.transformTranslate(info, 0, 0, { zTranslation: heightAdjust});
}

var transparent_ocean = false


var tileMarkerPositions =[]

// Date slider options
const CustomSwitcheroptionsPrimary = [
  {
    label:  <div style={{ fontSize: 15,color: 'white', whiteSpace: "nowrap" ,fontFamily: 'Inter'}}>2022</div>,
    value: 2022,
    color: "#32a871"
  },
  {
    label: <div style={{ fontSize: 15,color: 'white', whiteSpace: "nowrap" ,fontFamily: 'Inter'}}>2023</div>,
    value: 2023,
    color: "#32a871"
  }];

//Cesium ion api access token
// Ion.defaultAccessToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYjM5M2JiYy03ODhiLTQ2YmUtODhkNC0yNTdlZTQ2Y2RkOGMiLCJpZCI6MTU4OTgxLCJpYXQiOjE2OTY0MzgyNjJ9.4DRtmcWO-nxpnuMP8hNoq8AYgyy3ZQYYfxuZQ_p0W1w";

// Bathymetry image provider details
const emodnet_provider = new WebMapServiceImageryProvider({
  url : 'https://ows.emodnet-bathymetry.eu/wms',
  layers :  'mean_multicolour',
  proxy: new DefaultProxy('/proxy/'),
  minimumLevel: '0',
});



// const terrainProvider = await ArcGISTiledElevationTerrainProvider.fromUrl("https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer", {
//   token: "KED1aF_I4UzXOHy3BnhwyBHU4l5oY6rO6walkmHoYqGp4XyIWUd5YZUC1ZrLAzvV40pR6gBXQayh0eFA8m6vPg.."
// });


function Home() {

  const useMousePosition = () => {
    const [
      mousePosition,
      setMousePosition
    ] = useState({ x: null, y: null });
  
    useEffect(() => {
      const updateMousePosition = ev => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      };
      
      window.addEventListener('mousemove', updateMousePosition);
  
      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
    }, []);
  
    return mousePosition;}
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
        const outerCoreRadius = 6320000.0;
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
          400.0,
          0.0,
          800.0,
          1.0
        );
        globe._translucency._enabled = true
        globe._translucency._frontFaceAlphaByDistance._nearValue = 1;
        globe._translucency._frontFaceAlphaByDistance._farValue = true
        
        
        
        // // Set oceans on Bing base layer to transparent
        // if (transparent_ocean) {
        // const globe = viewer_ref.current.cesiumElement.scene.globe;
        // const baseLayer = viewer_ref.current.cesiumElement.scene.imageryLayers.get(0);
        // globe.showGroundAtmosphere = false;
        // globe.baseColor = Color.TRANSPARENT;
        // globe.translucency.enabled = true;
        // globe.undergroundColor = undefined;
        // baseLayer.colorToAlpha = new Color(0.0, 0.016, 0.059);
        // baseLayer.colorToAlphaThreshold = 0.2;}

        // Position camera
        viewer_ref.current.cesiumElement.camera.flyTo({
          destination: Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
        });

     

       // finally show viewer when it has been available to ref  
        setViewerReady(true)
    }}, 1); }, []);


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
      tileset._root.transform = computeTransform(cartographicPosition.latitude/ Math.PI * 180, cartographicPosition.longitude/ Math.PI * 180, verticalOffset); // or set tileset._root.transform directly

     // add attributes to marker array
      var pos = {}
      const tileSetPosition = tileset_ids.map(tiles => {
    
        if (Object.values(tiles).includes(tileset.featureIdLabel)  ) {
        pos = {"name":tiles.name,
                    "cartoPosition" : position,
                    "longitude" : (cartographicPosition.longitude/ Math.PI * 180),
                    "latitude" : (cartographicPosition.latitude/ Math.PI * 180),
                    "markerType" : tiles.markerPath,
                    "id" : tiles.id,
                  "temporalGroupID" : tiles.temporalGroupID}}})
         
        tileMarkerPositions.push(pos)
        const key = 'id';
        const arrayUniqueByKey = [...new Map(tileMarkerPositions.map(item =>
          [item[key], item])).values()];
        
        setTileMarkerAtt(arrayUniqueByKey)
      
     

      // //// Test centre of rotation settings
      //   var transform = Transforms.eastNorthUpToFixedFrame(tileset._root._boundingVolume._boundingSphere.center);
      // console.log(tileset._root._boundingVolume._boundingSphere.radius)
      //   // var cartographicTransform = viewer_ref.current.cesiumElement.scene.globe.ellipsoid.cartesianToCartographic(transform);
      //   // transform = Matrix4.IDENTITY;
      //   // transform = computeTransform(cartographicTransform.latitude/ Math.PI * 180, cartographicTransform.longitude/ Math.PI * 180, verticalOffset); 
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
       
      
    // clamp tiles to terrain
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
  const [sliderYear, setSliderYear] = useState([])
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



  const markerElements = tileMarkerAtt.map(markers => {
    return <Entity 
    key={markers.id}
    position={Cartesian3.fromDegrees(markers.longitude, markers.latitude,0)} 
    name={markers.name}
    onClick = {handleBillboardClick}
    onMouseEnter={handleMarkerHover}
    onMouseLeave={handleMarkerNoHover}
    >
 

    <BillboardGraphics image={markers.markerType} scale={0.03} />
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
      
    <div className="map-container" style={{visibility: viewerReady ? 'visible' : 'hidden' }}   >
      <Viewer skyBox = {false} infoBox={false} ref={viewer_ref}>
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

      {dateSliderContainerVis && <div className='date-slider-container'>
      <CustomSwitcher
        className="date-slider"
        options={CustomSwitcheroptionsPrimary}
          // value={2023}
        containerWidth={200}
        callback={(currentValue) => setSliderYear(currentValue)}> 
      </CustomSwitcher>
      </div>}

    </div>
 
  
   
    <div className="bathy-checkBox">
        <Checkbox/>
    </div>

    <SlidingPane className =  "model-sliding-pane"
      // closeIcon={<div>Some div containing custom close icon.</div>}
      isOpen={isModelInfo.isModelPaneOpenLeft}
      title="Model Vital Stats"
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
  );
}

export default Home;



