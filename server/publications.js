// Scenes publication
Meteor.publish("scenes", function() {
    return Scenes.find({
        $or : [
            { private: false },
            { createdBy: this.userId }
        ]
    });
});

Meteor.publish("singleScene", function(id) {
     return Objects.find({sceneId: id});
});