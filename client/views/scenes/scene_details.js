Template.sceneDetails.helpers({ 
    editors: function() { 
        return Meteor.users.find({_id: {$in : this.editors } });     
    },
    isOwner: function () {
        return this.ownerId === Meteor.userId();
    } 
}); 

Template.sceneDetails.events({ 
    "click .js-add-editors-modal": function(event, template) {
        Modal.show("addEditorsModal", this);
    },
    "click .js-remove-editors-modal": function(event, template) { 
        Modal.show("removeEditorsModal", this);
    },
    "click .js-delete-scene": function(event, template) {
        Meteor.call("deleteScene", this._id);
    }
}); 
