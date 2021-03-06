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

    // add the scene definition here
    scene =
    
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

    // start coding here


    function animate()
    {

        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

    animate();

    console.log('05 - Add physics!');
    
}, 1000);
