/* global handleSlide */
/* global applyEffectToMesh */

handleSlide = function (slider, value) {
    var sliderEffect = sliderEffects[slider];
    var sliderNormalizer = sliderValueNormalizer[slider];
    var scaledValue = sliderNormalizer(value);
    
    var settings = Session.get("settings");
    sliderEffect(settings, scaledValue);
    Session.set("settings", settings);
    
    Session.set("sliderValue", scaledValue);
    Session.set("sliderEffect", slider);
    Session.set("sliderChanged", true);
    
}

applyEffectToMesh = function (mesh, slider, value) {
    if (slider === "changeColor") {
        return meshChangeColor(mesh, value);
    } else {
        var sliderEffect = sliderEffects[slider];
        return sliderEffect(mesh, value);
    }
}


// A mappings from a slider name to a slider effect.
var sliderEffects = {
    "sizeX"         : changeSizeX,
    "sizeY"         : changeSizeY,
    "sizeZ"         : changeSizeZ,
    "rotateX"       : rotateX,
    "rotateY"       : rotateY,
    "rotateZ"       : rotateZ,
    "changeColor"   : changeColor,
    "positionX"     : movePositionX,
    "positionY"     : movePositionY,
    "positionZ"     : movePositionZ
};

function changeSizeX(object, value) {
    object.scale.x = value;
    return { "scale.x" : value };
}

function changeSizeY(object, value) {
    object.scale.y = value;
    return { "scale.y" : value };
}

function changeSizeZ(object, value) {
    object.scale.z = value;
    return { "scale.z" : value };
}

function rotateX(object, value) {
    object.rotation.x = value;
    return { "rotation.x" : value };
}

function rotateY(object, value) {
    object.rotation.y = value;
    return { "rotation.y" : value };
}

function rotateZ(object, value) {
    object.rotation.z = value;
    return { "rotation.z" : value };
}

function changeColor(object, color) {
    object.color = color;
    return { "color": color };
}

function meshChangeColor(mesh, color) {
    mesh.color = new THREE.Color(color);
    return { "color": color };
}

function movePositionX(mesh, value) {
    mesh.position.x += value;
    return { "position.x" : mesh.position.x };
}

function movePositionY(mesh, value) {
    mesh.position.y += value;
    return { "position.y" : mesh.position.y };
}

function movePositionZ(mesh, value) {
    mesh.position.z += value;
    return { "position.z" : mesh.position.z };
}
var sliderValueNormalizer = {
    "sizeX"         : sizeNormalizer,
    "sizeY"         : sizeNormalizer,
    "sizeZ"         : sizeNormalizer,
    "rotateX"       : rotationNormalizer,
    "rotateY"       : rotationNormalizer,
    "rotateZ"       : rotationNormalizer,
    "changeColor"   : colorNormalizer
};

function sizeNormalizer(value) {
    return (5*value);
}

function rotationNormalizer(value) {
    return (2*Math.PI*value);
}

function colorNormalizer(value) {
    // Identity operation
    return value;
}
