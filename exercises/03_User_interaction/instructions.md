Goal
====
Let the user navigate the scene and populate it with several geometries

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   in the _exercise.js_ stub provided, locate the declaration of a new dependency: __OrbitControl__; it is the controller which manages mouse interaction with the 3D scene

    ```javascript
    OrbitControls = require('three-orbit-controls')(THREE);
    ```

+   first, instance the __OrbitControl__ passing the camera as argument

    ```javascript
    orbitControls = new OrbitControls( camera );
    ```

+   now we can navigate... a simple cube; in order to enjoy more the scene, we may populate it with random cubes; for this aim I put three variables __pos_x__, __pos_y__, __pos_z__ 

    ```javascript
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
    ```

+   build the file using browserify and start the server, then head your browser to _localhost:8000_
