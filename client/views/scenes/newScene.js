Template.newScene.events({ 
    "submit .new-scene-form": function(event, template) { 
         event.preventDefault();
         var scene = {
             title:         $(event.target).find("[name=sceneTitle]").val(),
             description:  $(event.target).find("[name=sceneDescription]").val()
         }
         
         scene._id = Scenes.insert(scene);
         Router.go("/scene/" + scene._id, {_id: scene._id});
    } 
}); 
