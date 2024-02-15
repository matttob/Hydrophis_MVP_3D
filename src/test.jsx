//Zoom listener
viewer.camera.moveEnd.addEventListener(function() { 
    // the camera stopped moving
    updateDistanceScale();
 });
 

 export default  function updateDistanceScale()
 {
     var geodesic = new Cesium.EllipsoidGeodesic();
     var distances = [
         1, 2, 3, 5,
         10, 20, 30, 50,
         100, 200, 300, 500,
         1000, 2000, 3000, 5000,
         10000, 20000, 30000, 50000,
         100000, 200000, 300000, 500000,
         1000000, 2000000, 3000000, 5000000,
         10000000, 20000000, 30000000, 50000000];
 
      // Find the distance between two pixels at the bottom center of the screen.
      var width = viewer.scene.canvas.clientWidth;
      var height = viewer.scene.canvas.clientHeight;
 
      var left = viewer.scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
      var right = viewer.scene.camera.getPickRay(new Cesium.Cartesian2(1 + (width / 2) | 0, height - 1));
  
      var globe = viewer.scene.globe;
      var leftPosition = globe.pick(left, viewer.scene);
      var rightPosition = globe.pick(right, viewer.scene);
 
      if (typeof leftPosition == "undefined" || typeof rightPosition == "undefined") {
          $("#scalebartag").text("undefined");
          return;
     }
  
     var leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
     var rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);
 
     geodesic.setEndPoints(leftCartographic, rightCartographic);
     var pixelDistance = geodesic.surfaceDistance * 3.28084; //meters to feet
     var pixelDistanceMiles = pixelDistance / 5280;
 
     // Find the first distance that makes the scale bar less than 100 pixels.
     var maxBarWidth = 100;
     var distance;
     var label;
     var units;
 
     for (var i = distances.length - 1; i >= 0; --i) {
          if (distances[i] / pixelDistance < maxBarWidth) {
             if(distances[i] > 5280)
             {
                 for (var j = distances.length - 1; j >= 0; --j)
                 {
                     if (distances[j] / pixelDistanceMiles < maxBarWidth)
                     {
                         distance = distances[j];
                         units = " mi";
                         break;
                     }
                  }
                 break;
             }
             else
             {
                 distance = distances[i];
                 units = " ft";
                 break;
             }  
         }
     }
 
     if (typeof distance !== "undefined") {
 
         label = distance.toString() + units;
 
         if(units === " mi")
         {
             document.getElementById("scalebar").style.width = ((distance / pixelDistanceMiles) | 0).toString() + "px";
         }
         else
         {
             document.getElementById("scalebar").style.width = ((distance / pixelDistance) | 0).toString() + "px";
         }
     
         $("#scalebartag").text(label);
     } else {
         document.getElementById("scalebar").style.width = "100px";
         $("#scalebartag").text("undefined");
      }
 }