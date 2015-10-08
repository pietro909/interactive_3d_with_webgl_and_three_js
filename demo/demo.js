window.setTimeout(function onLoad() {
    'use strict';

    var
    // basic setup
    scene, camera, renderer, container, material, geometry, mesh,
    // lights
    theLight1, theLight2, ambientLight,
    // user interaction
    orbitControls, mouseVector, rayCaster,
    lastIntersected, highlightMaterial,
    // collisions
    planeGeometry, planeMaterial, planePhysiMaterial, planeMesh,
    // environment
    envSphereGeometry, envSphereText, envSphereMaterial, envSphere,
    cubeCam, meshAndCameras = [],
    // animation
    direction = 4,
    // render setup
    render_width = 640, render_height = 480,
    // dependencies here
    THREE = require('three'),
    // just a side-effect
    ColladaLoader = require('three-loaders-collada')(THREE),
    Physijs = require('physijs-browserify')(THREE),
    OrbitControls = require('three-orbit-controls')(THREE);

    Physijs.scripts.worker = '../node_modules/physijs-browserify/libs/physi-worker.js';
    Physijs.scripts.ammo = 'ammo.js';
    
    container = document.getElementById( 'theContainer' );

    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3( 0, -6, 0) );

    // let it dance in the air...
    setInterval(
        function( timeframe )
        {
            direction *= -1;
            var x = Math.random() * direction;
            var y = Math.random() * -10;
            scene.setGravity(
                new THREE.Vector3(x, y, 0)
            );
        },
        2000
    );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xaabbff);
    renderer.setSize(render_width, render_height);

    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(50, render_width / render_height, 1, 20000);
    camera.position.set( 0, 0, 200 );

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

    // bouncer
    planeGeometry = new THREE.PlaneGeometry( 200, 200 );
    planeMaterial = new THREE.MeshPhongMaterial(
        {
          // reflective?
          side: THREE.FrontSide,
          opacity: 0.5,
          transparency: true
        }
    );
    planeMesh = new Physijs.PlaneMesh(
        planeGeometry,
        Physijs.createMaterial( planeMaterial, 0.4, 0.8 )
    );
    planeMesh.position.setY( -100 );
    planeMesh.__dirtyPosition = true;
    planeMesh.rotateX( -Math.PI / 2 );
    planeMesh.__dirtyRotation = true;
    scene.add( planeMesh );

    var lidMesh = planeMesh.clone();
    lidMesh.position.setY( 100 );
    lidMesh.rotateX( Math.PI );
    scene.add( lidMesh );
   

    // the box container
/*
    var bigBoxGeometry = new THREE.BoxGeometry( 100, 100, 100 );
    var bigBoxMaterial = new THREE.MeshBasicMaterial({
        side: THREE.FrontSide //BackSide
    });
    var bigBox = new Physijs.BoxMesh(
        bigBoxGeometry,
        Physijs.createMaterial( bigBoxMaterial, 0.4, 0.8 )
    );
    scene.add( bigBox );

    var constraint = new Physijs.PointConstraint(
        bigBox, // First object to be constrained
        new THREE.Vector3( 0, 0, 0 ) // point in the scene to apply the constraint
    );
    scene.addConstraint( constraint );
*/
    // for reflections
    cubeCam = new THREE.CubeCamera(0.1, 10000, 512);
    cubeCam.renderTarget.mapping = THREE.CubeReflectionMapping;
    cubeCam.position.set(0, 0, 0);

    material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        envMap: cubeCam.renderTarget,
        reflectivity: 0.9
    });

    meshAndCameras.push( cubeCam );

    var loader = new THREE.ColladaLoader();
    loader.load(
        '../assets/3d/robot08.dae',
        function( model )
        {
            // 7 letters
            var x = 4;

            model.scene.traverse(
                function( node )
                {
                    var mesh, phyMat;
                    
                    if ( node instanceof THREE.Mesh )
                    {
                        phyMat = Physijs.createMaterial(
                            material,
                            0.3,
                            0.8
                        );
                        node.geometry.computeBoundingBox();
                        mesh = new Physijs.BoxMesh(
                            node.geometry,
                            phyMat
                        );
                        mesh.position.setX( 14 * x );
                        mesh.__dirtyPosition = true;
                        x -= 1;
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

        scene.simulate();
        
        renderer.render( scene, camera );

        requestAnimationFrame( animate );

    }

    animate();

    console.log('Demo');
    
}, 1000);
