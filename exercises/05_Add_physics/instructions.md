Goal
====
Find object intersected by mouse hovering

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   in the _exercise.js_ stub provided, locate the variables declaration and you'll spot out __mouseVector__ and __rayCaster__

+   in order to find intersected objects, we need to handle the __mousemove__ event

    ```javascript
    function onMouseMove( event )
    {
        var localX, localY, canvasX, canvasY;

        event.preventDefault();

    }

    container.onmousemove = onMouseMove;
    ```

+   the problem with event coordinates is that they are 2D coordinates, relative to the top left coorner: we have to remap them onto WebGL coordinates with (0, 0) located at the center of the canvas, in our event handler function

    ```javascript
    function onMouseMove( event )
    {
        var localX, localY, canvasX, canvasY;

        event.preventDefault();

        // canvas element local
        localX = event.pageX - theContainer.offsetLeft;
        localY = event.pageY - theContainer.offsetTop;
    
        // webgl context
        canvasX = ( localX / renderer.domElement.width ) * 2 - 1;
        canvasY = ( 1 - (localY / renderer.domElement.height ) ) * 2 - 1;
    }
    ```

+   once we have the right coordinates system, it's time to project a ray from mouse position to the vanishing point and then lookup intersected geometries; so let's initialize the mouse position container and the ray caster:

    ```javascript
    mouseVector = new THREE.Vector3();
    rayCaster = new THREE.Raycaster();
    ```

+   and now the actual projection: in the __intersections__ array are the intersected meshes, in the order they collide with the ray 

    ```javascript
    function onMouseMove( event )
    {
        //...

        mouseVector.set( canvasX, canvasY, 1 );

        rayCaster.setFromCamera( mouseVector, camera );

        var intersections = rayCaster.intersectObjects( scene.children );

        if (intersections.length > 0)
        {
            // the first intersected mesh
            selected = intersections[0].object;
        }
    }
    ```

+   in the provided example we change the object's material, restoring it when the pointer leave the object; to do this, we can use the already defined __highlightMaterial__

    ```javascript
    if (intersections.length > 0)
    {
        currentIntersection = intersections[0].object;
        currentIntersection.material = highlightMaterial;
    }

    // if a different one, restore it
    if (lastIntersected !== undefined && lastIntersected !== currentIntersection)
    {
        lastIntersected.material = material;
    }

    // update intersected object
    lastIntersected = currentIntersection;
    ```

+   build the file using browserify and start the server, then head your browser to _localhost:8000_
