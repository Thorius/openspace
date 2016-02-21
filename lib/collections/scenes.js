/* global Scenes */
Scenes = new Mongo.Collection("scenes");

Meteor.methods({
    addNewScene: function(sceneDetails) {
        validateLoggedIn("not-logged-in", "User must be logged in to create a scene.");
        sceneDetails.ownerId = Meteor.userId();
        return Scenes.insert(sceneDetails);
    },
    deleteScene: function (sceneId) {
        validateOwner(sceneId, "non-owner-delete", "Only owners may delete scenes.");    
        Scenes.remove(scene);
    },
    addEditor: function(sceneId, editorId) {
        validateOwner(sceneId, "non-owner-add-editor", "Only owners may add editors.");    
        Scenes.update({_id: sceneId}, {$push: {
            editors: editorId
        }});
    },
    removeEditor: function(sceneId, editorId) {
        validateOwner(sceneId, "non-owner-remove-editor", "Only owners may remove editors.");    
        Scenes.update({_id: sceneId}, {$pull: {
            editors: editorId
        }});
    },
    toggleScenePrivacy: function(sceneId, newState) {
        validateOwner(sceneId, "non-owner-toggle-privacy", "Only the scene's owner may change the privacy setting.");
        Scenes.update({_id: sceneId}, {$set:{
            private: newState
        }});
        
    }
}); 

function validateLoggedIn(shortErrorDescription, longErrorDescription) {
    var userId = Meteor.userId();
    if (!userId) {
        throw new Meteor.Error(shortErrorDescription, longErrorDescription);
    }
}

function validateOwner(sceneId, shortErrorDescription, longErrorDescription) {
    var userId = Meteor.userId();
    var scene = Scenes.findOne(sceneId, { fields : {ownerId: true} });
    if (userId !== scene.ownerId) {
        throw new Meteor.Error(shortErrorDescription, longErrorDescription);    
    }
}