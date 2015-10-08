window.setTimeout(function onLoad() {
    'use strict';

    var
    scene, camera, renderer, container, material, geometry, mesh,
    theLight1, theLight2, orbitControls, mouseVector, rayCaster,
    lastIntersected, highlightMaterial, physijsMaterial,
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
    
    camera = new THREE.PerspectiveCamera(50, render_width / render_height, 1, 1000);
    camera.position.set(0, 0, 40);

    orbitControls = new OrbitControls( camera );

    // warmer light from upper right
    theLight1 = new THREE.DirectionalLight(0xffdddd, 1);
    theLight1.position.set(10, 10, 20);
    scene.add(theLight1);
    
    // colder light from upper left
    theLight2 = new THREE.DirectionalLight(0xddddff, 0.7);
    theLight2.position.set(10, 10, -20);
    scene.add(theLight2);

    geometry = new THREE.BoxGeometry( side, side, side );
    material = new THREE.MeshLambertMaterial({ color: 0xffee44 });
    physijsMaterial = Physijs.createMaterial( material, 0.3, 0.8 ); 
    

    function makeCubes( timestamp )
    {
        var random = Math.random() * 30;
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

        scene.add( mesh );

    }

    window.setInterval( makeCubes, 700 );
    
    function animate()
    {
        scene.simulate();
        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

    animate();

    console.log('05 - Add physics!');
    
}, 1000);
