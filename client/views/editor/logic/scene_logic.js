/* global invoke */
/* global markMeshForRemoval */

invoke = function (scene, mode, settings) {
    var event = eventFactory[mode];
    if (event) {       
        return event(scene, settings)
    }
}


// Function for updating the Objects collection in such a way as to mark the selected
// object for later removal.
markMeshForRemoval = function (meshId) {
    Meteor.call("markMeshForRemoval", meshId, function(error, success) { 
        if (error) { 
            console.log("Could not mark mesh for removal", error); 
        }
    });
}

var eventFactory = {
    "selectObjects"  :   selectObject,
    "addObjects"     :   addObject,
    "selectLights"   :   selectLight,
    "addLights"      :   addLight,
    "updateObjects"  :   updateObject,
    "updateLights"   :   updateLight
};

// Function that checks if an object is intersected by a ray casted from the camera position
// through a point clicked on the scene. 
// Returns the name of the closest object intersected or null if no object is intersected.
function selectObject(scene, settings) {
    var unprojected = settings.unprojectedClick;
    var camera = settings.cameraPosition;
    // Create a raycaster object for the intersections.
    var raycaster = new THREE.Raycaster(camera, unprojected.sub(camera).normalize());
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        return intersects[0].object.name;
    } else {
        return null;
    }
}

// This function takes the following steps:
//  1) Call the geometry constructor provided by the geometry factory.
//  2) Call the material constructor provided by the material factory.
//  3) Create a mesh using a geometry and a material.
//  4) Add the mesh to the scene and, if necessary, updated the DB.
function addObject(scene, settings) {
    var objectDescriptor = null;
    if (settings.addToDb) {
        objectDescriptor = { mode: "addObjects" };
    }
    var geometryContructor = geometryFactory[settings.geometryConstructor];
    // Simply skip elements marked for removal or if no constructor is selected.
    if (!geometryContructor) {
        return;
    }
    var geometry = geometryContructor(settings, objectDescriptor);
    
    // TODO: Use a mesh factory
    var materialConstructor = createMeshLambertMaterial;
    var material = materialConstructor(settings, objectDescriptor);
    
    var mesh = createMesh(geometry, material, objectDescriptor);
    
    calculateObjectPosition(settings);
    applyMeshTransforms(mesh, settings, objectDescriptor);
    applyMaterialTransforms(mesh, settings, objectDescriptor);
    
    if (settings.addToDb) {
        objectDescriptor.sceneId = scene._id;
        Meteor.call("addMesh", objectDescriptor, function(error, success) { 
            if (error) { 
                console.log("Could not add mesh to collection.", error); 
            } 
            if (success) { 
                 mesh.name = success;
                 scene.add(mesh);
            } 
        });    
    } else {
        mesh.name = settings._id;
        scene.add(mesh);
    }
}

function selectLight(scene, settings) {
    // TODO:
}

function addLight(scene, settings) {
    var lightDescriptor = null;
    if (settings.addToDb) {
        lightDescriptor = { mode: "addLights"};
    }
    var lightContructor = lightFactory[settings.lightConstructor];
    // Simply skip elements marked for removal or if no constructor is selected.
    if (!lightContructor) {
        return;
    }
    var light = lightContructor(settings, lightDescriptor);
    
    calculateObjectPosition(settings);
    applyMeshTransforms(light, settings, lightDescriptor);
    
    if (settings.addToDb) {
        lightDescriptor.sceneId = scene._id;
        Meteor.call("addMesh", lightDescriptor, function(error, success) { 
            if (error) { 
                console.log("Could not add light to collection.", error); 
            } 
            if (success) { 
                 light.name = success;
                 scene.add(light);
            } 
        });    
    } else {
        light.name = settings._id;
        scene.add(light);
    }
}

function updateObject(scene, settings) {
    var mesh = scene.getObjectByName(settings._id);
    applyMeshTransforms(mesh, settings, null);
    applyMaterialTransforms(mesh, settings, null);
}

function updateLight(scene, settings) {
    // TODO:
}

var geometryFactory = {
    "cube"      :   createCube,
    "sphere"    :   createSphere,
    "torus"     :   createTorus
};

function createCube(settings, objectDescriptor) {
    // TODO: Use the settings object to customize the new shapes
    var geometry = new THREE.BoxGeometry(5,5,5);
    if (objectDescriptor) {
        objectDescriptor.geometryConstructor = "cube";
    }
    return geometry;
}

function createSphere(settings, objectDescriptor) {
    var geometry = new THREE.SphereGeometry(5, 20, 20);
    if (objectDescriptor) {
        objectDescriptor.geometryConstructor = "sphere";
    }
    return geometry;
}

function createTorus(settings, objectDescriptor) {
    var geometry = new THREE.TorusGeometry( 5, 2, 8, 20 );
    if (objectDescriptor) {
        objectDescriptor.geometryConstructor = "torus";
    }
    return geometry;
}

var lightFactory = {
    "point"      :   createPoint,
    "ambient"    :   createAmbient,
    "spotlight"  :   createSpotLight
};

function createPoint(settings, lightDescriptor) {
    var light = new THREE.PointLight(0xffffff, 1, 100);
    //light.shadowCameraNear = 0.1;
    //light.shadowCameraFar = 100;
    light.castShadow = true;
    light.color = new THREE.Color(settings.color);
    if (lightDescriptor) {
        lightDescriptor.color = settings.color;
        lightDescriptor.lightConstructor = "point";
    }
    return light;
}

function createSpotLight(settings, lightDescriptor) {
    var light = new THREE.SpotLight(0xffffff);
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 100;
    light.castShadow = true;
    light.color = new THREE.Color(settings.color);
    if (lightDescriptor) {
        lightDescriptor.color = settings.color;
        lightDescriptor.lightConstructor = "spotlight";
    }
    return light;
}

function createAmbient(settings, lightDescriptor) {
    var light = new THREE.AmbientLight(0xffffff);
    //light.shadowCameraNear = 10;
    //light.shadowCameraFar = 100;
    //light.castShadow = true;
    light.color = new THREE.Color(settings.color);
    if (lightDescriptor) {
        lightDescriptor.color = settings.color;
        lightDescriptor.lightConstructor = "ambient";
    }
    return light;
}

function createMeshLambertMaterial(settings, objectDescriptor) {
    var material = new THREE.MeshLambertMaterial();
    return material;
}

function applyMaterialTransforms(mesh, settings, objectDescriptor) {
    if (objectDescriptor) {
        objectDescriptor.color = settings.color;
    }
    mesh.material.color = new THREE.Color(settings.color);
}

function createMesh(geometry, material, objectDescriptor) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    //mesh.position.set(position.x, position.y, position.z);
    // Set the time of creation.
    mesh.lastUpdate = new Date();
    // Prevent double addition of objects to the scene by storing the time of the last created mesh.
    Session.set("lastMeshCreated", mesh.lastUpdate);
    if (objectDescriptor) {
        //objectDescriptor.position = mesh.position.clone();
        objectDescriptor.lastUpdate = mesh.lastUpdate;
    }
    return mesh
}

function applyMeshTransforms(mesh, settings, objectDescriptor) {
    mesh.position.set(settings.position.x, settings.position.y, settings.position.z);
    mesh.rotation.set(settings.rotation.x, settings.rotation.y, settings.rotation.z);
    mesh.scale.set(settings.scale.x, settings.scale.y, settings.scale.z);
    if (objectDescriptor) {
        objectDescriptor.position = settings.position;
        objectDescriptor.rotation = settings.rotation;
        objectDescriptor.scale = settings.scale;
    }
}

function calculateObjectPosition(settings) {
    if (!settings.addToDb) {
        return settings.position;
    }
    // Unproject the click and then advance the position vector in
    // the direction of the unprojected vector.  
    var unprojected = settings.unprojectedClick;
    var position = settings.cameraPosition.clone();
    unprojected.sub(position);
    unprojected.normalize();
    unprojected.multiplyScalar(20);
    position.add(unprojected);
    settings.position = position;
}

function addToSceneDataBase(sceneId, objectDescriptor, mesh, callback) {
    objectDescriptor.sceneId = sceneId;
    return Objects.insert(objectDescriptor, function (error, result) {
        mesh.name = result;
        callback(mesh);
    });
}