Meteor.startup(function() {
    Meteor.subscribe("scenes");
    Meteor.subscribe("users");
});