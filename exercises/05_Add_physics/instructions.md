Goal
====
Add physical simulation and let the cube fall

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   in the _exercise.js_ find out the new dependencies: __Physijs__, the engine which integrates with __ThreeJs__ 

    ```javascript
    Physijs = require('physijs-browserify')(THREE)
    ```

+   the engine needs to be configured with the __Ammo.js__ script path and the __physi-worker.js__ script path

    ```javascript
    Physijs.scripts.worker = 'node_modules/physijs-browserify/libs/physi-worker.js';
    Physijs.scripts.ammo = 'ammo.js';
    ```

+   as first step, let's use the __Physijs.Scene__ instead of standard __THREE.Scene__: this object provides the __setGravity__ method which takes a __THREE.Vector3__ describing the global forces

    ```javascript
    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3( 0, -30, 0));
    ```

+   next step, use the material's wrapper provided by the framework: it takes the standard material and two parameters which describe how the object reacts to collisions

    ```javascript
    physijsMaterial = Physijs.createMaterial( material, 0.3, 0.8 ); 
    ```

+   and finally create a __Physijs.BoxMesh__ that is the wrapper for __THREE.BoxMesh__ and takes the same parameters: geometry and material

    ```javascript
    mesh = new Physijs.BoxMesh( geometry, physijsMaterial );
    scene.add( mesh );
    ```

+   the last step is to run the update of the simulation each frame, in order to have the objects' positions up to date

    ```javascript
    scene.simulate();
    ```

+   build the file using browserify and start the server, then head your browser to _localhost:8000_
