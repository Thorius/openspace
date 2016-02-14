Template.scenes.helpers({ 
    private: function() { 
         return Scenes.find( { private: true } );
    }, 
    publicMine: function () {
        return Scenes.find( { createdBy: Meteor.userId(), private: false } );
    },
    publicOthers: function() { 
         return Scenes.find( { createdBy: { $ne: Meteor.userId() } } );
    }
}); 

Template.scenes.events({ 
    "click": function(event, template) { 
         
    } 
}); 
