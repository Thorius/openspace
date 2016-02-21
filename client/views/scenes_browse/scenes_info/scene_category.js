Template.sceneCategory.helpers({
    scenesList: function() {
        return Scenes.find(this.searchFilter);
    }
});