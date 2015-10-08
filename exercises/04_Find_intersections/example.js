window.setTimeout(function onLoad() {
    'use strict';

    var
    scene, camera, renderer, container, material, geometry, mesh,
    theLight1, theLight2, orbitControls, mouseVector, rayCaster,
    lastIntersected, highlightMaterial,
    pos_x, pos_y, pos_z,
    scale = 1, side = 3,
    render_width = 640, render_height = 480,
    THREE = require('three'),
    OrbitControls = require('three-orbit-controls')(THREE);

    container = document.getElementById('theContainer');

    scene = new THREE.Scene();
    
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
    highlightMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        opacity: 0.6,
        transparent: true
    });

    for (var i = 0; i < 20; i += 1)
    {
        pos_x = (i%2 === 0) ? (i * Math.random() + side) : (i * -Math.random() + side);
        pos_y = (i%2 === 0) ? (i * Math.random() + side) : (i * -Math.random() + side);
        pos_z = (i%2 === 0) ? (i * Math.random() + side) : (i * -Math.random() + side);
        
        scale += 0.04;
        mesh = new THREE.Mesh( geometry, material );

        mesh.position.set( pos_x, pos_y, pos_z );
        mesh.rotateX( pos_x );
        mesh.rotateY( pos_y );
        mesh.rotateZ( pos_z );
        mesh.scale.set( scale, scale, scale );
        scene.add( mesh );
    }

    mouseVector = new THREE.Vector3();
    rayCaster = new THREE.Raycaster();

    function onMouseMove(event)
    {
        var localX, localY, canvasX, canvasY;

        event.preventDefault();

        // canvas element local
        localX = event.pageX - theContainer.offsetLeft,
        localY = event.pageY - theContainer.offsetTop,
        // webgl context
        canvasX = (localX / renderer.domElement.width) * 2 - 1,
        canvasY = (1 - (localY / renderer.domElement.height)) * 2 - 1;

        checkIntersections(canvasX, canvasY);

    }

    function checkIntersections(mouseX, mouseY)
    {
        var currentIntersection;

        mouseVector.set(mouseX, mouseY, 1);

        rayCaster.setFromCamera(mouseVector, camera);

        var intersections = rayCaster.intersectObjects( scene.children );

        if (intersections.length > 0)
        {
            currentIntersection = intersections[0].object;
            currentIntersection.material = highlightMaterial;
        }

        if (lastIntersected !== undefined && lastIntersected !== currentIntersection)
        {
            lastIntersected.material = material;
        }

        lastIntersected = currentIntersection;

    }
    
    function animate()
    {
        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

    container.onmousemove = onMouseMove;
    animate();

    console.log('04: Find intersections!');
    
}, 1000);
