Template.buttons.events({ 
    "click .js-mode-button": function(event, template) {
        event.preventDefault();
        var modeName = $(event.currentTarget).data("mode");
        // Store the name of the object constructor in the settings variable.
        Session.set("clickMode", modeName);        
    },
    "click .js-object-button": function(event, template) { 
        event.preventDefault();
        var objectName = $(event.currentTarget).data("object");
        // Store the name of the object constructor in the settings variable.
        var settings = Session.get("settings");
        settings.geometryConstructor = objectName;
        Session.set("settings", settings);
    },
    "click .js-light-button": function(event, template) { 
        event.preventDefault();
        var lightName = $(event.currentTarget).data("light");
        // Store the name of the object constructor in the settings variable.
        var settings = Session.get("settings");
        settings.lightConstructor = lightName;
        Session.set("settings", settings);
    },
    "click .js-remove-object-button": function(event, template) {
        event.preventDefault();
        var selectedObjectName = Session.get("selectedObjectName");
        if (selectedObjectName) {
            markMeshForRemoval(selectedObjectName);
        }
    }
}); 
