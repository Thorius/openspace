Template.editor.helpers({
    canEdit: function() {
        var res = Scenes.find({_id: this._id, $or: [
            {ownerId: Meteor.userId()},
            {editors: Meteor.userId()}
        ] }, {fields: {_id: true} } );
        if (res.count()) {
            return true;
        } else {
            return false
        }
    }
});