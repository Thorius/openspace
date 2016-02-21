Template.sceneDetails.helpers({ 
    editors: function() { 
        return Meteor.users.find({_id: {$in : this.editors } });     
    },
    owner: function() {
        return Meteor.users.findOne({_id: this.ownerId});
    },
    isOwner: function() {
        return this.ownerId === Meteor.userId();
    },
    togglePrivateText: function() {
        if (this.private) {
            return "Make scene public";
        } else {
            return "Make scene private";
        }
    }
}); 

Template.sceneDetails.events({ 
    "click .js-add-editors-modal": function() {
        Modal.show("addEditorsModal", this);
    },
    "click .js-remove-editors-modal": function() { 
        Modal.show("removeEditorsModal", this);
    },
    "click .js-delete-scene": function() {
        Meteor.call("deleteScene", this._id);
    },
    "click .js-toggle-private": function() {
        Meteor.call("toggleScenePrivacy", this._id, !this.private);
    }
}); 
