/* global Objects */
Objects = new Mongo.Collection("objects");

Meteor.methods({ 
    markMeshForRemoval: function(meshId) {
        Objects.update(meshId, {
            $set: {geometryConstructor: "none", lastUpdate: new Date()}
        });
    },
    addMesh: function (meshInfo) {
        return Objects.insert(meshInfo);
    },
    updateMesh: function(meshId, updateInfo) { 
        updateInfo.lastUpdate = new Date();
        Objects.update(meshId, {$set : updateInfo});
    } 
});