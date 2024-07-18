
import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2,Terrain} from 'cesium'

 // set some viewer properties
export default async function viewerProperties(viewer_ref,setIsGemsChecked,setIsBathyChecked,  setIsBarraChecked,setDateSliderContainerVis,setSliderYear)  {
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
 globe._translucency._frontFaceAlphaByDistance._nearValue = 0.1
 globe._translucency._frontFaceAlphaByDistance._farValue = true
// globe.show = false


 //   // SPIN GLOBE For 1st animation
      //   var previousTime = Date.now();
      //   var spinRate = 1.0;
      //   function applyGlobeSpin() {
      //     var currentTime = Date.now();
      //     var delta = ( currentTime - previousTime ) / 1000;
      //     previousTime = currentTime;
      //     viewer_ref.current.cesiumElement.scene.camera.rotate(Cartesian3.UNIT_Z, -spinRate * delta);
      // }
      //   viewer_ref.current.cesiumElement.clock.onTick.addEventListener(applyGlobeSpin)


// // flyTo barra fish pens

//   viewer_ref.current.cesiumElement.camera.flyTo({
//     destination : Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
//     easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//     duration: 1,
//     complete: function () {
//       setTimeout(function () {
//         viewer_ref.current.cesiumElement.camera.flyTo({
//           destination : Cartesian3.fromDegrees(-7.34146,  57.00554  , 800),
//           easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//           duration: 10,
//           complete: function () {
//             setTimeout(function () {
//               viewer_ref.current.cesiumElement.camera.flyTo({
//                 destination : Cartesian3.fromDegrees(-7.34177, 57.00494  , -1),
//                 easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//                 duration: 5,
//                 complete: function () {
//                   setTimeout(function () {
//                     viewer_ref.current.cesiumElement.camera.flyTo({
//                       destination : Cartesian3.fromDegrees(-7.34146,  57.00554  , 3000),
//                       easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//                       duration: 5
//                     });
//                   }, 1000);
//                 },
//               });
//             }, 1000);
//           },
//         });
//       }, 1000);
//     },
//   });


  // // // // flyTo barra fish pens zoom

  // viewer_ref.current.cesiumElement.camera.flyTo({
  //   destination : Cartesian3.fromDegrees(-7.33629,  57.00476  , 180),
  //   easingFunction: EasingFunction.QUADRATIC_IN_OUT,
  //   duration: 1,
  //   complete: function () {
  //     setTimeout(function () {
  //       viewer_ref.current.cesiumElement.camera.flyTo({
  //         destination : Cartesian3.fromDegrees(-7.34146,  57.00554  , 4000),
  //         easingFunction: EasingFunction.QUADRATIC_IN_OUT,
  //         duration: 2 ,
  //         complete: function () {  setIsGemsChecked(true)
          
  //           setTimeout(function () {
  //             viewer_ref.current.cesiumElement.camera.flyTo({
  //               destination : Cartesian3.fromDegrees(-7.34146,  57.00554  , 1100000),
  //               easingFunction: EasingFunction.QUADRATIC_IN_OUT,
  //               duration: 5 ,
  //               complete: function () { setIsBathyChecked(true)

  //                 setTimeout(function () {
  //                   viewer_ref.current.cesiumElement.camera.flyTo({
  //                     destination : Cartesian3.fromDegrees(-7.34146,  57.00554  , 10000000),
  //                     easingFunction: EasingFunction.QUADRATIC_IN_OUT,
  //                     duration: 5 ,
  //                     complete: function () { 
                      
                      
  //                     }
  //                   });
  //                 }, 2000)
                
                
  //               }
  //             });
  //           }, 2000)
          
  //         }
  //       });
  //     }, 2000);
  //   },
  // });


// // // flyTo lagoon knoll

//   viewer_ref.current.cesiumElement.camera.flyTo({
//     destination : Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
//     easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//     duration: 1,
//     complete: function () {
//       setTimeout(function () {
//         viewer_ref.current.cesiumElement.camera.flyTo({
//           destination : Cartesian3.fromDegrees(71.7734,  -5.41496  , 60),
//           easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//           duration:1,
//           complete: function () {
//             setTimeout(function () { 
//               setDateSliderContainerVis(true)
//               viewer_ref.current.cesiumElement.camera.flyTo({
//                 destination : Cartesian3.fromDegrees(71.7734,  -5.41496  , 20),
//                 easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//                 duration: 1,
//                 complete: function () {
//                   setTimeout(function () { 
//                     setDateSliderContainerVis(true)
//                     viewer_ref.current.cesiumElement.camera.flyTo({
//                       destination : Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
//                       easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//                       duration: 5,
                      
        
//                     });
                    
//                   }, 1000);
//                 },
  
//               });
              
//             }, 1000);
//           },
//         });
//       }, 1000);
//     },

//   });





// // flyTo ardmucknish Crack

// viewer_ref.current.cesiumElement.camera.flyTo({
//   destination : Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
//   easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//   duration: 1,
//   complete: function () {
//     setTimeout(function () {
//       setIsBarraChecked(true)
//       viewer_ref.current.cesiumElement.camera.flyTo({
//         destination : Cartesian3.fromDegrees(-5.43544,  56.45733  , 25),
//         easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//         duration:5,
//         complete: function () {
//           setTimeout(function () {
            
//           }, 2000);

//           setTimeout(function () {
//             viewer_ref.current.cesiumElement.camera.flyTo({
//               destination : Cartesian3.fromDegrees(-5.43540,  56.45730  , -10),
//               easingFunction: EasingFunction.QUADRATIC_IN_OUT,
//               duration: 5 ,
//               complete: function () { 
              
              
//               }
//             });
//           }, 2000)
//         },

//       });
//     }, 1000);
//   },

// });



// // // Position camera
//  viewer_ref.current.cesiumElement.camera.flyTo({
//    destination: Cartesian3.fromDegrees(-7.34146,  57.00554  , 3000),
//  })

// // // Position camera
//  viewer_ref.current.cesiumElement.camera.flyTo({
//    destination: Cartesian3.fromDegrees( -4.041795,  56.683053, 24000000),
//  })
}