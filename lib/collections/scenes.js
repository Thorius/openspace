/* global Scenes */
Scenes = new Mongo.Collection("scenes");

Meteor.methods({
    addNewScene: function(sceneDetails) {
        var userId = Meteor.userId();
        console.log(userId);
        if (!userId) {
            throw new Meteor.Error("not-logged-in", "User must login to create a scene.");
        }
        sceneDetails.createdBy = userId;
        return Scenes.insert(sceneDetails);
    } 
}); 