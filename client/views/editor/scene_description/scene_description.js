Template.sceneDescription.helpers({
    editors: function() {
        return Meteor.users.find({_id: {$in : this.editors } }); 
    },
    owner: function() {
        return Meteor.users.findOne({_id: this.ownerId});
    }
});