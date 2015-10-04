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
    Physijs = require('physijs-browserify')(THREE),
    OrbitControls = require('three-orbit-controls')(THREE),
    prefix = 'node_modules/physijs-browserify/libs/';

    // physi-worker.ja is relative to the page, ammo.js is relative to physi-worker.js position
    Physijs.scripts.worker = 'node_modules/physijs-browserify/libs/physi-worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    container = document.getElementById('theContainer');

    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3( 0, -30, 0));
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xaabbff);
    renderer.setSize(render_width, render_height);

    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(50, render_width / render_height, 1, 20000);
    camera.position.set(0, 0, 40);

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
    envSphereText = THREE.ImageUtils.loadTexture('assets/images/bologna_by_night.jpg');
    envSphereText.minFilter = THREE.NearestFilter;
    envSphereMaterial = new THREE.MeshBasicMaterial({
        map: envSphereText,
        side: THREE.BackSide
    });
    envSphere = new THREE.Mesh(
        envSphereGeometry,
        envSphereMaterial
    );
    
    scene.add(envSphere);

    geometry = new THREE.BoxGeometry( side, side, side );

    // for reflections
    cubeCam = new THREE.CubeCamera(0.1, 10000, 512);
    cubeCam.renderTarget.mapping = THREE.CubeReflectionMapping;
    cubeCam.position.set(0, 0, 0);

    material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: cubeCam.renderTarget,
        reflectivity: 0.9
    });
    
    physijsMaterial = Physijs.createMaterial( material, 0.3, 0.8 );

    // the ground: a rough plane
    planeGeometry = new THREE.PlaneGeometry( 100, 100, 100);
    planeMaterial = new THREE.MeshLambertMaterial({ color: 0x2266ff });
    planePhysiMaterial = Physijs.createMaterial( planeMaterial, 0.1, 0.6 );
    // use a BoxMesh, otherwise it will detect collisions only at the center
    planeMesh = new Physijs.BoxMesh( planeGeometry, planePhysiMaterial );
    planeMesh.position.setY( -10 );
    planeMesh.__dirtyPosition = true;
    planeMesh.rotateX( -Math.PI / 2 );
    planeMesh.__dirtyRotation = true;
    scene.add( planeMesh );

    function makeCubes( timestamp )
    {
        var random;
        
        random = Math.random() * 30;
        pos_x = (timestamp % 2 === 0) ? (random + side) : (random - side);
        pos_y = 20;
        pos_z = 0;
        
        scale = Math.random() + 0.5;
        
        mesh = new Physijs.BoxMesh( geometry, physijsMaterial );
        mesh.position.set( pos_x, pos_y, pos_z );
        mesh.__dirtyPosition = true;
        
        mesh.rotateX( pos_x );
        mesh.rotateY( pos_y );
        mesh.rotateZ( pos_z );
        mesh.__dirtyRotate = true;
        
        mesh.scale.set( scale, scale, scale );
        mesh.__dirtyScale = true;

        // save meshes and cameras to update
        meshAndCameras.push({
            camera : cubeCam,
            mesh : mesh
        });

        scene.add( mesh );

    }

    var timeout = window.setInterval(
        function()
        {
            makeCubes();

            // 20 is hanging my Chrome window :-)
            if (scene.children.length > 16)
            {
                window.clearInterval(timeout);
            }
        }, 2100 );
    
    function animate()
    {
        var i = meshAndCameras.length;
        while (i--) {
            meshAndCameras[i].camera.updateCubeMap( renderer, scene );
        }

        scene.simulate();
        
        renderer.render( scene, camera );

        requestAnimationFrame( animate );

    }

    animate();

    console.log('07 - Environment map!');
    
}, 1000);
