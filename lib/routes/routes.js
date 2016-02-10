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
    this.render("navbar", {to: "header"});
    this.render("scenes", {to: "main"});
});

Router.route("/newScene", function () {
    this.render("navbar", {to: "header"});
    this.render("newScene", {to: "main"});
});

Router.route("/scene/:_id", function () {
    // Find the scene by id.
    var scene = Scenes.findOne({_id : this.params._id}); 
    this.render("navbar", {to: "header"});
    this.render("editor", {to: "main", data: scene});
});
