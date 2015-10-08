Goal
====
Let the cube rotate and scale automatically

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   in the _exercise.js_ stub provided, find the new variables __scale__ and __k_scale__ which are initialized with default values

    ```javascript
     scale = 1, k_scale = 0.01,
    ```

+   locate the __animate()__ function in the stub provided

    ```javascript
    function animate()
    {
        // start coding here
        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }
    ```

+   let's start animating rotation: for each frame we want the cube be rotated around __Y__ axis of 0.01 _radians_

    ```javascript
    mesh.rotateY( 0.01 );
    ```

+   now add an extra rotation around the __Z__ axis of 0.005 _radians_, to have a more interesting transformation

    ```javascript
    mesh.rotateZ( 0.005 );
    ```

+   we can combine several transformations, like for example the scale; in this case the transformation has just one direction (positive) so we need to invert it when it reaches a defined limit

    ```javascript
    k_scale = (scale > 2 || scale < 1) ? -k_scale : k_scale;
    scale += k_scale;
    mesh.scale.set( scale, scale, scale );
    ```

    + build the file using browserify and start the server, then head your browser to _localhost:8000_
