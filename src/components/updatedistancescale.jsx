import {defined,Cesium3DTileStyle,defaultValue,ScreenSpaceEventType,ScreenSpaceEventHandler,Ellipsoid,EasingFunction, Math as CesiumMath,NearFarScalar, Rectangle,ArcGISTiledElevationTerrainProvider,CesiumTerrainProvider,HeadingPitchRoll,Matrix4,Transforms, Cartesian3, Color, viewerCesiumInspectorMixin ,viewerCesium3DTilesInspectorMixin, IonResource, Ion, WebMapServiceImageryProvider, DefaultProxy, WebMapTileServiceImageryProvider, Credit,TextureMinificationFilter, TextureMagnificationFilter,DebugModelMatrixPrimitive,EllipsoidGeodesic,Cartesian2} from 'cesium'


export default function updateDistanceScale(viewer_ref,setDistanceScaleText,setScaleBarVisible)

{viewer_ref.current.cesiumElement.camera.moveEnd.addEventListener(function(){
  
    { var geodesic = new EllipsoidGeodesic();
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
            setScaleBarVisible(false)}
          }
    })}