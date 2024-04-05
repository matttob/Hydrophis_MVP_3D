 import {CesiumTerrainProvider} from 'cesium'

export default   async function createCustomTerrain(viewer_ref)

{

 

    
    try {
        // High resolution terrain of Pennsylvania curated by Pennsylvania Spatial Data Access (PASDA)
        // http://www.pasda.psu.edu/
        viewer_ref.current.terrainProvider = await CesiumTerrainProvider.fromIonAssetId(
            2518730
        );
      } catch (error) {
        window.alert(`Failed to load terrain. ${error}`);
      }
        
  
 }
     
  

