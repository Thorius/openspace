Template.newScene.events({ 
    "click .js-add-edditor": function(event, template) {
        // TODO: Make it possible to add editors.  
    },
    "submit .new-scene-form": function(event, template) { 
         event.preventDefault();
         var scene = {
             title:         $(event.target).find("[name=sceneTitle]").val(),
             description:   $(event.target).find("[name=sceneDescription]").val(),
             private:       $(event.target).find("[name=scenePrivacy]").is(':checked'),
             editors:       [],
             dateCreated:   new Date()
         };
         
         Meteor.call("addNewScene", scene, function (error, success) {
            if (error) {
                console.log("Could not add a new scene!",error);
                return;
            }
            // Route to the new scene.
            Router.go("/scene/" + success, {_id: success});
         });
    }
}); 
