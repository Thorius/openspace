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
