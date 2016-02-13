Template.controls.onRendered(function() {
    Meteor.setTimeout(function() { 
         setUpSession();
    }, 100);
});


Template.controls.onCreated(function() {
    Meteor.setTimeout(function() { 
         initializeUiElements();
    }, 100);
});

function setUpSession() {
    Session.set("isMouseDragged", false);
    Session.set("clickMode", null);
    Session.set("dragEventName", null);
    Session.set("lastEvent", null);
    Session.set("lastMeshCreated", new Date());
    Session.set("cameraControlsOn", false);
    Session.set("selectedObjectName", null);
    Session.set("sliderName", null);
    Session.set("sliderValue", 0.0);
    Session.set("sliderChanged", false);
    initializeSettings();
}

function initializeSettings() {
    var settings = {};
    settings.addToDb = true;
    settings.color = chroma('#FFFFFF').hex();
    var defaultRotation = (2 * Math.PI * 0.5);
    settings.rotation = { x: defaultRotation, y: defaultRotation, z: defaultRotation };
    settings.scale = { x: 1.0, y: 1.0, z: 1.0 };
    Session.set("settings", settings);
}

function initializeUiElements() {
    // Color picker code.
    $(".color-picker").colorpicker().on('changeColor.color-picker', function(event){
        var settings = Session.get("settings");
        var color = event.color.toHex();
        settings.color = color;
        Session.set("settings", settings);
        handleSlide("changeColor", color);
    });
    // Slider code.
    $(".slider").slider({
        min: 0, max: 1,
        step: 0.01, value: 0.5,
    }).on('slide', throttle( function(event){
        // The slider's nested data value.
        var sliderEffectName = event.target.dataset.slider;
        handleSlide(sliderEffectName, event.value);
    }, 150)).on('slideStop', function(event){
        // Just repeat the event without the throttle.
        var sliderEffectName = event.target.dataset.slider;
        handleSlide(sliderEffectName, event.value);
    });
}