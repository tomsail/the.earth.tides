import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/three@0.124.0//examples/jsm/libs/dat.gui.module.js';
const textureLoader = new THREE.TextureLoader();

function createControls(camera, canvas, rotation) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
	controls.autoRotate = true;
  controls.autoRotateSpeed =  rotation;
  controls.enablePan = true;
  
  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();
  return controls;
}

function initParams(){
  const params = {
    map: 0,
    sunLight: 4,
    earthRotation: 0.002,
    showClouds: false,
    showBathy: false,
    showTides: true,

    enabled: true,
    avgLuminance: 1.3,
    middleGrey: 3.2,
    maxLuminance: 30,

    adaptionRate: 2.0,
    opacityLights : 0.4,
    mapHeight : 1.8
  };
  return params
}

function initGui(params, earth){
  const gui = new GUI();
  gui.close();

  // const sceneGui = gui.addFolder( 'Scenes' );
  // const toneMappingGui = gui.addFolder( 'ToneMapping' );
  // const staticToneMappingGui = gui.addFolder( 'StaticOnly' );
  // const adaptiveToneMappingGui = gui.addFolder( 'AdaptiveOnly' );

  gui.add( params, 'earthRotation', 0.000073, 0.003 );
  gui.add( params, 'mapHeight', 1.6, 8 );
  gui.add( params, 'showClouds' ).name( 'Show clouds' );
  gui.add( params, 'showTides' ).name( 'Show tides' ).onChange( function ( val ) {
    switch ( val ) {
      case true:
        earth.loadVid()
        break;
      case false :
        earth.loadTex()
        break;
    }
  });
  gui.add( params, 'showBathy' ).name( 'Show Bathy' ).onChange( function ( val ) {

    switch ( val ) {

      case true:
        console.log(params.map );
        switch ( params.map ) {
          case 0 : 
            console.log('loading bathy')
            earth.loadBathyTerrain();
            earth.loadBathy();
            earth.loadSpec();
            break;

          case '1': 
            console.log('loading bathy 3000')
            earth.loadBathyTerrain();
            earth.loadBathy3000();
            earth.loadSpec3000();
            break;
        }
        break;

      case false:    
        switch ( params.map ) {
          case '0' : 
            console.log('loading topo')  
            earth.loadTerrain();
            earth.loadTex();
            earth.loadSpec()
            break;
          case '1': 
            console.log('loading topo 3000')  
            earth.loadTerrain3000();
            earth.loadTex3000();
            earth.loadSpec3000();
            break;
        }
        break;
      };
  } );
  gui.add( params, 'map', { 'now': 0, 'in 3000': 1 } ).onChange( function ( val ) {
    switch ( val ) {

      case '0':
        switch ( params.showBathy ) {
          case true:
            console.log('loading current map bathy')
            earth.loadBathyTerrain();
            earth.loadLights();
            earth.loadBathy();
            earth.loadSpec();
            break;
          case false:
            console.log('loading current map')
            earth.loadTerrain();
            earth.loadTex();
            earth.loadSpec()
            earth.loadLights();
            break;
        }
        break;

      case '1':
        switch ( params.showBathy ) {
          case true:
            console.log('loading future map bathy')
            earth.loadBathyTerrain();
            earth.loadBathy3000();
            earth.loadSpec3000();
            earth.loadLights3000();
            break;
          case false:
            console.log('loading future map')
            earth.loadTerrain3000();
            earth.loadTex3000();
            earth.loadSpec3000();
            earth.loadLights3000();
            break;
        }
        break;
    }

  } );
  // gui.add( params, 'sunLight', 0, 5 );
  // gui.add( params, 'opacityLights', 0.0, 1.0 );

  // toneMappingGui.add( params, 'enabled' );
  // toneMappingGui.add( params, 'middleGrey', 0, 12 );
  // toneMappingGui.add( params, 'maxLuminance', 1, 30 );
  // staticToneMappingGui.add( params, 'avgLuminance', 0.001, 2.0 );
  // adaptiveToneMappingGui.add( params, 'adaptionRate', 0.0, 10.0 );


  return (gui)
} 

export { createControls, initParams, initGui};