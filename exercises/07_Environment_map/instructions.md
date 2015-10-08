Goal
====
Add an environment map

Instructions
============

+   start from index.html

+   let the script point your _exercise.js_ file

+   create the sphere onto map the environment map

    ```javascript
    envSphereGeometry = new THREE.SphereGeometry(5000, 64, 64);
    ```

+   create a material with the texture provided _bologna_by_night.jpg_

    ```javascript
    envSphereText = THREE.ImageUtils.loadTexture('assets/images/bologna_by_night.jpg');
    envSphereText.minFilter = THREE.NearestFilter;
    envSphereMaterial = new THREE.MeshBasicMaterial({
        map: envSphereText,
        side: THREE.BackSide
    });
    ```

+   create the sphere mesh and add it to the scene

    ```javascript
    envSphere = new THREE.Mesh(
        envSphereGeometry,
        envSphereMaterial
    );
    
    scene.add(envSphere);
    ```

+   in order to see the environment reflected, we need to add a __THREE.CubeCamera__

    ```
    // for reflections
    cubeCam = new THREE.CubeCamera(0.1, 10000, 512);
    cubeCam.renderTarget.mapping = THREE.CubeReflectionMapping;
    cubeCam.position.set(0, 0, 0);
    scene.add( cubeCam );
    ```

+   and last, create the material which will get the reflections

    ```javascript
    material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: cubeCam.renderTarget,
        reflectivity: 0.9
    });
    ```

+   and finally let the camera projection be updated in the __animate__ function

    ```javascript
    cubeCam.updateCubeMap( renderer, scene );
    ```

+   build the file using browserify and start the server, then head your browser to _localhost:8000_
