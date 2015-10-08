Goal
====
Place a static geometry to see the cube bounce

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   in the _exercise.js_ find out the new dependencies: __Physijs__, the engine which integrates with __ThreeJs__ 

    ```javascript
    Physijs = require('physijs-browserify')(THREE)
    ```

+   create a __THREE.PlaneGeometry__, a material and set up a brand new __Physijs.BoxMesh__

    ```javascript
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
    ```

+   the plane is created vertically aligned by default: we need to rotate it, translate at the bottom and than mark it as _dirty_ in order to let the engine know that the position and rotation are changed

    ```javascript
    planeMesh.position.setY( -10 );
    planeMesh.__dirtyPosition = true;
    planeMesh.rotateX( -Math.PI / 2 );
    planeMesh.__dirtyRotation = true;
    scene.add( planeMesh );
    ```

+   build the file using browserify and start the server, then head your browser to _localhost:8000_
