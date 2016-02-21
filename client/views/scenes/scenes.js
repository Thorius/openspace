Template.scenes.helpers({ 
    private: function() { 
         return Scenes.find( { private: true } );
    }, 
    publicMine: function () {
        return Scenes.find( { ownerId: Meteor.userId(), private: false } );
    },
    publicOthers: function() { 
         return Scenes.find( { ownerId: { $ne: Meteor.userId() } } );
    }
}); 

Template.scenes.events({ 
    "click": function(event, template) { 
         
    } 
}); 
