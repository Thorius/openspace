/* global Router */
Router.configure({
    layoutTemplate: "layout"
});

Router.route("/", function () {
    this.render("navbar", {to: "header"});
    this.render("home", {to: "main"});
});

Router.route("/about", function () {
    this.render("navbar", {to: "header"});
    this.render("about", {to: "main"});
});

Router.route("/scenes", function () {
    // Add the subscription to the waiting list.
    //this.wait(Meteor.subscribe("scenes"));
    this.render("navbar", {to: "header"});
    //if (this.ready()) {
        this.render("scenes", {to: "main"});
    //} else {
        //this.render("loading", {to: "main"});
    //}
});

Router.route("/newScene", function () {
    this.render("navbar", {to: "header"});
    this.render("newScene", {to: "main"});
});

Router.route("/scene/:_id", function () {
    // Find the scene by id.
    var scene = Scenes.findOne({_id : this.params._id}); 
    this.wait(Meteor.subscribe("singleScene", this.params._id));
    
    this.render("navbar", {to: "header"});
    if (this.ready()) {
        this.render("editor", {to: "main", data: scene});
    } else {
        this.render("loading", {to: "main"});
    }
    
});
