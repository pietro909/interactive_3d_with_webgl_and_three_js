window.setTimeout(function onLoad() {
    'use strict';

    var
    // basic setup
    scene, camera, renderer, container, material, geometry, mesh,
    // lights
    theLight1, theLight2, ambientLight,
    // user interaction
    orbitControls, mouseVector, rayCaster,
    intersectables = [], lastIntersected, highlightMaterial, overMaterial,
    _highlightMaterial, _overMaterial,
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

    Physijs.scripts.worker = 'physi-worker.js';
    Physijs.scripts.ammo = 'ammo.js';
    
    container = document.getElementById( 'theContainer' );

    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3( 0, -6, 0) );

    // let the gravity grow...
    var gravity = -2;
    setInterval(
        function( timeframe )
        {
            direction *= -1;
            var x = Math.random() * direction;
            gravity -= 1;
            scene.setGravity(
                new THREE.Vector3(x, gravity, 0)
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
    envSphereText = THREE.ImageUtils.loadTexture('interactive_3d_with_webgl_and_three_js/assets/images/bologna_by_night.jpg');
    envSphereText.minFilter = THREE.NearestFilter;
    envSphereMaterial = new THREE.MeshBasicMaterial({
        map: envSphereText,
        side: THREE.BackSide
    });
    envSphere = new THREE.Mesh(
        envSphereGeometry,
        Physijs.createMaterial( envSphereMaterial, 0.3, 0.8 )
    );
    envSphere.rotateY( Math.PI / 2.28 );
    scene.add( envSphere );

    // bouncer
    planeGeometry = new THREE.PlaneGeometry( 300, 200 );
    planeMaterial = new THREE.MeshPhongMaterial(
        {
          // reflective?
          side: THREE.FrontSide,
          opacity: 0.5,
          transparent: true
        }
    );
    planeMesh = new Physijs.BoxMesh(
        planeGeometry,
        Physijs.createMaterial( planeMaterial, 0.4, 0.8 )
    );
    planeMesh.position.setY( -100 );
    planeMesh.__dirtyPosition = true;
    planeMesh.rotateX( -Math.PI / 2 );
    planeMesh.__dirtyRotation = true;
    scene.add( planeMesh );
  
    // for reflections
    cubeCam = new THREE.CubeCamera(0.1, 10000, 512);
    cubeCam.renderTarget.mapping = THREE.CubeReflectionMapping;
    cubeCam.position.set(0, 0, 0);

    material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        envMap: cubeCam.renderTarget,
        reflectivity: 0.9
    });

    // for selected meshes
    _highlightMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        opacity: 0.6,
        transparent: true
    });
    highlightMaterial = Physijs.createMaterial( _highlightMaterial, 0.4, 0.1 );

    // for selected meshes
     _overMaterial = new THREE.MeshLambertMaterial({
        color: 0xcccccc
    });
    overMaterial = Physijs.createMaterial( _overMaterial, 0, 0 );

    meshAndCameras.push( cubeCam );

    function handleCollision( collidedWith, linearVelocity, angularVelocity )
    {
        var gameOver,
            me = this,
            myIndex = intersectables.indexOf( me );

        me.userData.collisions += 1;

        if ( me.userData.collisions > 5 )
        {
            intersectables.splice( myIndex, 1 );
            me.material = overMaterial;

            if ( intersectables.length === 0 && myIndex !== -1)
            {
                console.log('game over!');
                
            }
        }

    }

    var loader = new THREE.ColladaLoader();
    loader.load(
        'interactive_3d_with_webgl_and_three_js/assets/3d/robot08.dae',
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
                        mesh.position.setY( 60 );
                        mesh.position.setZ( -20 );
                        mesh.__dirtyPosition = true;
                        x -= 1;

                        // manage collisions
                        mesh.userData.collisions = 0;
                        mesh.addEventListener( 'collision', handleCollision );

                        // find intersections only with letters
                        intersectables.push( mesh );
                        scene.add( mesh );
                    }
                }
            );
        }
    );

    mouseVector = new THREE.Vector3();
    rayCaster = new THREE.Raycaster();

    var mouse_is_down = false;

    function onMouseDown( event )
    {
        var canvasCoords, selectedObj;

        event.preventDefault();

        canvasCoords = normalizeCoordinates( event );
        selectedObj = checkIntersections(canvasCoords.x, canvasCoords.y);

        // only if left button pressed and an object is selected
        if ( selectedObj !== undefined && event.which === 1 )
        {
            selectedObj.position.setY( 60 );
            selectedObj.__dirtyPosition = true;
        }

    }

    function onMouseMove( event )
    {
        var canvasCoords, selectedObj;

        event.preventDefault();

        canvasCoords = normalizeCoordinates( event );
        selectedObj = checkIntersections(canvasCoords.x, canvasCoords.y);
        colorSelection( selectedObj );
        lastIntersected = selectedObj;

    }

    function normalizeCoordinates( event )
    {
        var localX, localY, canvasX, canvasY;

        // canvas element local
        localX = event.pageX - container.offsetLeft,
        localY = event.pageY - container.offsetTop,
        // webgl context
        canvasX = (localX / renderer.domElement.width) * 2 - 1,
        canvasY = (1 - (localY / renderer.domElement.height)) * 2 - 1;

        return {
          x: canvasX,
          y: canvasY
        };

    }

    function colorSelection( selectedObj )
    {
         // color current selection
        if ( selectedObj !== undefined )
        {
            selectedObj.material = highlightMaterial;
        }

        // restore color of previous selection, if present
        if (lastIntersected !== undefined && lastIntersected !== selectedObj)
        {
            lastIntersected.material = material;
        }
    }

    function checkIntersections( mouseX, mouseY )
    {

        mouseVector.set(mouseX, mouseY, 1);

        rayCaster.setFromCamera(mouseVector, camera);

        var intersections = rayCaster.intersectObjects( intersectables );

        return ( intersections.length > 0 ) ? intersections[0].object : undefined;

    }
    
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

    container.onmousemove = onMouseMove;
    container.onmousedown = onMouseDown;

    animate();

    console.log('Demo');
    
}, 1000);
