window.setTimeout(function onLoad() {
    'use strict';

    var
    scene, camera, renderer, container, material, geometry, mesh,
    theLight1, theLight2, ambientLight, orbitControls, mouseVector, rayCaster,
    lastIntersected, highlightMaterial, physijsMaterial,
    planeGeometry, planeMaterial, planePhysiMaterial, planeMesh,
    envSphereGeometry, envSphereText, envSphereMaterial, envSphere,
    cubeCam,
    meshAndCameras = [],
    pos_x, pos_y, pos_z,
    scale = 1, side = 3,
    render_width = 640, render_height = 480,
    THREE = require('three'),
    // just a side-effect
    ColladaLoader = require('three-loaders-collada')(THREE),
    Physijs = require('physijs-browserify')(THREE),
    OrbitControls = require('three-orbit-controls')(THREE);
    
    container = document.getElementById('theContainer');

    scene = new Physijs.Scene();
    //scene.setGravity( new THREE.Vector3( 0, -30, 0));
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xaabbff);
    renderer.setSize(render_width, render_height);

    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(50, render_width / render_height, 1, 20000);
    camera.position.set( 0, 0, 10 );

    orbitControls = new OrbitControls( camera );

    // ambient light to pump up the environment
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // warmer light from upper right
    theLight1 = new THREE.DirectionalLight(0xffdddd, 1);
    theLight1.position.set(10, 10, 20);
    scene.add(theLight1);
    
    // colder light from upper left
    theLight2 = new THREE.DirectionalLight(0xddddff, 0.7);
    theLight2.position.set(10, 10, -20);
    scene.add(theLight2);


    // environment map
    envSphereGeometry = new THREE.SphereGeometry(5000, 64, 64);
    envSphereText = THREE.ImageUtils.loadTexture('../assets/images/bologna_by_night.jpg');
    envSphereText.minFilter = THREE.NearestFilter;
    envSphereMaterial = new THREE.MeshBasicMaterial({
        map: envSphereText,
        side: THREE.BackSide
    });
    envSphere = new THREE.Mesh(
        envSphereGeometry,
        Physijs.createMaterial( envSphereMaterial, 0.3, 0.8 )
    );
    
    scene.add( envSphere );

    // for reflections
    cubeCam = new THREE.CubeCamera(0.1, 10000, 512);
    cubeCam.renderTarget.mapping = THREE.CubeReflectionMapping;
    cubeCam.position.set(0, 0, 0);

    material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        envMap: cubeCam.renderTarget,
        reflectivity: 0.9
    });

    physijsMaterial = Physijs.createMaterial( material, 0.3, 0.8 );

    meshAndCameras.push( cubeCam );

    var loader = new THREE.ColladaLoader();
    loader.load(
        '../assets/3d/robot08.dae',
        function( model )
        {
            model.scene.traverse(
                function( node )
                {
                    var mesh;
                    
                    if ( node instanceof THREE.Mesh )
                    {
                        mesh = new Physijs.BoxMesh( node.geometry, material );
                        mesh.scale.set( 100, 100, 100 );
                        mesh.__dirtyScale = true;
                        scene.add( mesh );
                    }
                }
            );
        }
    );
        
    
    
    function animate()
    {
        var i = meshAndCameras.length;
        while (i--) {
            meshAndCameras[i].updateCubeMap( renderer, scene );
        }

//        scene.simulate();
        
        renderer.render( scene, camera );

        requestAnimationFrame( animate );

    }

    animate();

    console.log('Demo');
    
}, 1000);
