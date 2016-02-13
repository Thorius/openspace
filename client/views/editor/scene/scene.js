Template.scene.events({ 
    "mouseenter": function() { 
        Session.set("cameraControlsOn", true);
    },
    "mouseleave": function() { 
        Session.set("cameraControlsOn", false);
    }
}); 
