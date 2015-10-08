Goal
====
Create your firts ThreeJs scene

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   retrieve your container with

    ```javascript
    container = document.getElementById(id)
    ```

+   create new renderer, set its background color and size

    ```javascript
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xaabbff);
    renderer.setSize(render_width, render_height);
	```

+   append the render output (__canvas__ element) to the container

    ```javascript
    container.appendChild( renderer.domElement );
    ```
    
+   then create a brand new scene, which will be the containers of all objects

	```javascript
    scene = new THREE.Scene();
    ```
    
+   create new __THREE.Camera__ with the right parameters: it requires the field of view (FOV), the ratio between renderer's width and height, the near and far clipping planes; These are typical common parameters but you can adjust them as you wish

    ```javascript
    camera = new THREE.PerspectiveCamera(50, render_width / render_height, 1, 1000);
    camera.position.set(0, 0, 40);
    ```

+   time to add lights: we are going to use two  __THREE.DirectionalLight__ in order to achieve a more interesting lighting

    ```javascript
    // warmer light from upper right
    theLight1 = new THREE.DirectionalLight(0xffdddd, 1);
    theLight1.position.set(10, 10, 20);
    scene.add(theLight1);
    
    // colder light from upper left
    theLight2 = new THREE.DirectionalLight(0xddddff, 0.7);
    theLight2.position.set(10, 10, -20);
    scene.add(theLight2);
    ```
    
+   we are ready to put a __THREE.Mesh__ into the scene, in order to do that we need to create a __geometry__ (which describes the actual __mesh__ vertices) and a __material__ (which describes how the __mesh__ reacts to the light)

    ```javascript
    geometry = new THREE.BoxGeometry(6, 6, 6);
    material = new THREE.MeshBasicMaterial({ color: 0xffee44 });
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh )
    ```

+   in order to get the scene rendered, we must trigger it for each frame using __requestAnimationFrame()__ method

    ```javascript
    function animate()
    {
        
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

    animate();
    ```

    + build the file using browserify and start the server, then head your browser to _localhost:8000_
