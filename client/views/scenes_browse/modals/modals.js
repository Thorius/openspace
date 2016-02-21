Template.addEditorsModal.helpers({
    showNonEditors: function() {
        return Meteor.users.find( { $and: [
            {_id: {$ne: this.ownerId} },
            {_id: {$nin: this.editors }}
        ] });
    }
});

Template.addEditorsModal.events({ 
    "click .js-add-editor": function(event, template) { 
        // Extract the scene id from the parent context.
        var sceneId = template.data._id;
        // Do the same for the editor id.
        var editorId = this._id;
        Meteor.call("addEditor", sceneId, editorId); 
        // Hide everything regarding the clicked editor
        var searchString = "#" + editorId;
        $(searchString).hide();
    } 
});


Template.removeEditorsModal.helpers({
    currentEditors: function() {
        return Meteor.users.find({_id: {$in : this.editors} });
    }
});

Template.removeEditorsModal.events({ 
    "click .js-remove-editor": function(event, template) { 
         // Extract the scene id from the parent context.
        var sceneId = template.data._id;
        // Do the same for the editor id.
        var editorId = this._id;
        Meteor.call("removeEditor", sceneId, editorId); 
        // Hide everything regarding the clicked editor
        var searchString = "#" + editorId;
        $(searchString).hide();
    } 
});