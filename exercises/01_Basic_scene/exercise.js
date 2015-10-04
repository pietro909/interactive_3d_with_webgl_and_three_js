window.setTimeout(function onLoad() {
    'use strict';

    var
    scene, camera, renderer, container,
    render_width = 640, render_height = 480,
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
    var theLight1 = new THREE.DirectionalLight(0xffdddd, 1);
    theLight1.position.set(10, 10, 20);
    scene.add(theLight1);
    
    // colder light from upper left
    var theLight2 = new THREE.DirectionalLight(0xddddff, 0.7);
    theLight2.position.set(10, 10, -20);
    scene.add(theLight2);

    var boxGeometry = new THREE.BoxGeometry(6, 6, 6);
    var material = new THREE.MeshBasicMaterial({ color: 0xffee44 });
    var boxMesh = new THREE.Mesh( boxGeometry, material );

    scene.add( boxMesh );

    function animate()
    {
        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

    animate();    
    
    console.log('01 - Basic scene!');
    
}, 1000);
