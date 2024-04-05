 import {createGooglePhotorealistic3DTileset} from 'cesium'

export default   async function createGoogleTiles(viewer_ref)

{

 

    
      // google tiles trial
      // Add Photorealistic 3D Tiles
// Add Photorealistic 3D Tiles
try {
    const tileset = await createGooglePhotorealistic3DTileset();
    viewer_ref.current.cesiumElement.scene.primitives.add(tileset);
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
      ${error}`);
  }
        
  
 }
     
  

