/* global Deps */

// Three.js objects.
var renderer;// = new THREE.WebGLRenderer();
var scene = null;// = new THREE.Scene();
var camera;// = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000);
var cameraControls;// = new THREE.OrbitControls(camera);

// Scene update variable
var lastUpdate;// = null;

Template.scene.onCreated(function() {
    // Set up Three.js objects
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000);
    cameraControls = new THREE.OrbitControls(camera);
    lastUpdate = null;
})

Template.scene.onRendered(function(){
    // Add the current scene id to the Three.js scene object
    scene._id = Session.get("currentSceneId");
    // Set up the key press events
    $(document).keypress(function (event) {
        // Key codes:
        //   119    -> w    -> forward
        //   97     -> a    -> left
        //   115    -> s    -> back
        //   100    -> d    -> right
        console.log(event.which);
        switch (event.which) {
            case 87:    // Forward
            case 119:   
                moveObject("positionX", 1);
                break;
            case 83:    // Back
            case 115:
                moveObject("positionX", -1);
                break;
            case 65:    // Left
            case 97:    
                moveObject("positionZ", 1);
                break;
            case 68:    //Right
            case 100:   
                moveObject("positionZ", -1);
                break;
            case 82:    //Up
            case 114: 
                moveObject("positionY", 1);                
                break;
            case 70:    //Down
            case 102: 
                moveObject("positionY", -1);
                break;
            default:
                break;
        }
    });
    
    initiateAutoRun();
    
    $(window).resize(handleResize);
    init();
});

Template.scene.events({ 
    "mouseenter": function() { 
        Session.set("cameraControlsOn", true);
        cameraControls.enabled = true;
    },
    "mouseleave": function() { 
        Session.set("cameraControlsOn", false);
        cameraControls.enabled = false;
    },
    "click #main-scene": function(event) {
        if (!Session.get("isMouseDragged") && Session.get("clickMode")) {
            // Properly set the last click event.
            Session.set("lastEvent", "click");
            var settings = Session.get("settings");
            // Unproject click
            var clickVector = projectClick(event);
            
            clickVector.unproject(camera);
            // Save the information of unprojecting the click event in the settings variable
            settings.unprojectedClick = clickVector;
            settings.cameraPosition = camera.position; 
            Session.set("settings", settings);
            // Extract the current click event.
            var clickMode = Session.get("clickMode");
            var result = invoke(scene, clickMode, settings);
            // Handle the result of the event.
            handleEventResult(result);
        }
   },
   "mousedown #main-scene": function() {
       // Add a timeout to check if the user is holding down the button.
       Meteor.setTimeout(function() { 
           Session.set("isMouseDragged", true); 
       }, 100);
   },
   "mouseup #main-scene": function() {
       // Add a timeout to revert the previous change.
       Meteor.setTimeout(function() { 
           Session.set("isMouseDragged", false); 
       }, 100);
   }
});

function initiateAutoRun() {
    // Get the most distant date for the first run.
    lastUpdate = new Date(0);
    // Deps for database access.
    Deps.autorun(function(comp) {
        
        Session.set("sceneCreationTime", scene.dateCreated);
        
        var sceneObjects = Objects.find( {lastUpdate: {$gt : lastUpdate} } ).fetch();
        lastUpdate = new Date(); 
        sceneObjects.forEach(function (currentObject) {
            var sesionTime = Session.get("lastMeshCreated").valueOf();
            var objectTime = currentObject.lastUpdate.valueOf();
            if (sesionTime === objectTime) {
                return;
            }
            var renderedObject = scene.getObjectByName(currentObject._id);
            if (!renderedObject) {
                invoke(scene, currentObject.mode, currentObject);
            } else if (renderedObject.lastUpdated != currentObject.lastUpdate) {
                // Check if the updated object has been marked for removal or need to be updated.
                if (currentObject.geometryConstructor === "none") {
                    scene.remove(renderedObject);
                } else {    // Update the object!
                    invoke(scene, "updateObjects", currentObject);
                }
            }
            
        });    
    });
    // Deps for slider events.
    Deps.autorun(function(comp){
        if (Session.equals("sliderChanged", true)){
            var sliderName;
            var objectName;
            var value;
            Deps.nonreactive(function () {
                sliderName = Session.get("sliderEffect");
                Session.set("sliderChanged", false);
                objectName = Session.get("selectedObjectName");
                value = Session.get("sliderValue");
            });
            if (!Session.equals("selectedObjectName", undefined) && !Session.equals("selectedObjectName", null)) {
                var selectedMesh = scene.getObjectByName(objectName);
                var updateInfo = applyEffectToMesh(selectedMesh, sliderName, value);
                Meteor.call("updateMesh", objectName, updateInfo , function(error, success) { 
                    if (error) { 
                        console.log("Mesh update failed!", error); 
                    } 
                });
            }
        }
    });
}

function init() { 
    
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    camera.position.x = 15;
    camera.position.y = 16;
    camera.position.z = 13;
    camera.lookAt(scene.position);
    
    //addGridHelper();
    //addAxisHelper();
    
    //addPlane();
    //addStaticCube();
    addSpotLight();
    addAmbientLight();
    
    $("#main-scene").append(renderer.domElement);
    // Call the render function
    render();
}

function render() {
    cameraControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addSpotLight() {
    var pointLight = new THREE.PointLight(0xffffff, 1, 200);
    pointLight.castShadow = true;
    pointLight.position.set(20, 20, 20);
    var pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
    //pointLight2.castShadow = true;
    pointLight2.position.set(-20, 20, 20);
    scene.add(pointLight);
    //scene.add(pointLight2);
    
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 1.0;
    spotLight.position.set(10, 20, 20);
    spotLight.shadowCameraNear = 10;
    spotLight.shadowCameraFar = 200;
    spotLight.castShadow = true;
    //scene.add(spotLight);
    
    /*var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(10, -20, -20);
    spotLight2.shadowCameraNear = 10;
    spotLight2.shadowCameraFar = 100;
    spotLight2.castShadow = true;
    scene.add(spotLight2);*/
}

function addAmbientLight() {
    var light = new THREE.AmbientLight( 0x404040 ); 
    scene.add(light);
}

// Function to calculate the unprojected vector based on a click.
function projectClick(event) {
    // Grab the scene.
    var sceneContainer = $("#main-scene");
    // The offset is determined by the position of the canvas and the amount the window has scrolled.
    var offsetX = sceneContainer.offset().left - $(window).scrollLeft();
    var offsetY = sceneContainer.position().top - $(window).scrollTop();
    // Calculate the position of the vector
    var x = ((event.clientX - offsetX)/window.innerWidth)*2-1;
    var y = -((event.clientY - offsetY)/window.innerHeight)*2+1;
    var z = 0.5;
    return new THREE.Vector3(x, y, z);
}

function handleEventResult(result) {
    var lastEvent = Session.get("lastEvent");
    if (lastEvent === "click") {
        Session.set("selectedObjectName", result);
    } else if (lastEvent === "drag") {
        //handleDrag(Session.get("selectedObjectName"), result);
    }
}
