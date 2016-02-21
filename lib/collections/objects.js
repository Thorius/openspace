/* global Objects */
Objects = new Mongo.Collection("objects");

Meteor.methods({ 
    markMeshForRemoval: function(meshId) {
        if (this.userId) {
            Objects.update(meshId, {
                $set: {geometryConstructor: "none", lastUpdate: new Date()}
            });
        }
    },
    addMesh: function (meshInfo) {
        if (this.userId){
            return Objects.insert(meshInfo);
        }
    },
    updateMesh: function(meshId, updateInfo) { 
        if (this.userId) {
            updateInfo.lastUpdate = new Date();
            Objects.update(meshId, {$set : updateInfo});
        }
    },
    removeMeshes: function(removeFilter) {
        if(this.userId) {
            Objects.remove(removeFilter);
        }
    }
});