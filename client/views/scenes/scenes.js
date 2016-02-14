Template.scenes.helpers({ 
    editable: function() { 
         return Scenes.find( { createdBy: Meteor.userId() } );
    }, 
    viewable: function() { 
         return Scenes.find( { createdBy: { $ne: Meteor.userId() } } );
    }
}); 

Template.scenes.events({ 
    "click": function(event, template) { 
         
    } 
}); 
