/* global Scenes */
Scenes = new Mongo.Collection("scenes");

Meteor.methods({
    addNewScene: function(sceneDetails) {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("not-logged-in", "User must be logged in to create a scene.");
        }
        sceneDetails.ownerId = userId;
        return Scenes.insert(sceneDetails);
    },
    deleteScene: function (sceneId) {
        var userId = Meteor.userId();
        var scene = Scenes.findOne(sceneId, { fields : {ownerId: true} });
        if (userId !== scene.ownerId) {
            throw new Meteor.Error("non-owner-delete", "Only owners may delete scenes.");    
        }
        Scenes.remove(scene);
    },
    addEditor: function(sceneId, editorId) {
        var userId = Meteor.userId();
        var scene = Scenes.findOne(sceneId, { fields : {ownerId: true} });
        if (userId !== scene.ownerId) {
            throw new Meteor.Error("non-owner-add-editor", "Only owners may add editors.");    
        }
        Scenes.update({_id: sceneId}, {$push: {
            editors: editorId
        }});
    },
    removeEditor: function(sceneId, editorId) {
       var userId = Meteor.userId();
        var scene = Scenes.findOne(sceneId, { fields : {ownerId: true} });
        if (userId !== scene.ownerId) {
            throw new Meteor.Error("non-owner-remove-editor", "Only owners may remove editors.");    
        }
        Scenes.update({_id: sceneId}, {$pull: {
            editors: editorId
        }});
    }
}); 