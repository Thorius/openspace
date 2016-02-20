/* global moveObject */

moveObject = function(keyPressName, delta) {
    
    Session.set("sliderValue", delta);
    Session.set("sliderEffect", keyPressName);
    Session.set("sliderChanged", true);
}