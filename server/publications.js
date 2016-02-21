// Scenes publication
Meteor.publish("scenes", function() {
    return Scenes.find({
        $or : [
            { private: false },
            { ownerId: this.userId },
            { editors: this.userId }
        ]
    });
});

// Publication for the objects of a given scene.
Meteor.publish("singleScene", function(id) {
     return Objects.find({sceneId: id});
});

// Publication for registered users of the site
Meteor.publish("users", function() {
    return Meteor.users.find();
});