window.setTimeout(function onLoad() {
    'use strict';

    var
    // basic setup
    scene, camera, renderer, container, material, geometry, mesh,
    // lights
    theLight1, theLight2, ambientLight,
    // render setup
    render_width = 640, render_height = 480,
    // animation's variables
    scale = 1, k_scale = 0.01,
    // dependencies here
    THREE = require('three');

    container = document.getElementById('theContainer');

    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xaabbff);
    renderer.setSize(render_width, render_height);

    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(50, render_width / render_height, 1, 1000);
    camera.position.set(0, 0, 40);

    // warmer light from upper right
    theLight1 = new THREE.DirectionalLight(0xffdddd, 1);
    theLight1.position.set(10, 10, 20);
    scene.add(theLight1);
    
    // colder light from upper left
    theLight2 = new THREE.DirectionalLight(0xddddff, 0.7);
    theLight2.position.set(10, 10, -20);
    scene.add(theLight2);

    geometry = new THREE.BoxGeometry(6, 6, 6);
    material = new THREE.MeshLambertMaterial({ color: 0xffee44 });
    mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );
    
    function animate()
    {
        // start coding here
        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

    animate();

    console.log('02: Animate transformations!');
    
}, 1000);
