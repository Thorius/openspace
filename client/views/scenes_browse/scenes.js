Template.scenes.helpers({ 
    private: function() { 
         return Scenes.find( { private: true } );
    }, 
    publicMine: function () {
        return Scenes.find( { ownerId: Meteor.userId(), private: false } );
    },
    publicOthers: function() { 
         var publicOtherFilter = { $and: [
            { ownerId: { $ne: Meteor.userId() } },
            { editors: { $ne: Meteor.userId() } }
         ] };
             
         var publicOther = {categoryTitle: "Public Scenes ", searchFilter: publicOtherFilter };
         return publicOther;
    },
    allSceneCategories: function() {
        var categoryDescriptors = [];
        // Descriptor for the user's private scenes
        var privateMineFilter = { ownerId: Meteor.userId(), private: true };
        var privateMine = {categoryTitle: "My Private Scenes", searchFilter: privateMineFilter };
        categoryDescriptors.push(privateMine);
        // Descriptor for the user's public scenes
        var publicMineFilter = { ownerId: Meteor.userId(), private: false };
        var publicMine = {categoryTitle: "My Public Scenes", searchFilter: publicMineFilter };
        categoryDescriptors.push(publicMine);
        // Descriptor for the private scenes where the user is and editor
        var privateEditorFilter = { editors: Meteor.userId(), private: true };
        var privateEditor = {categoryTitle: "Private Scenes where I am an Editor", searchFilter: privateEditorFilter };
        categoryDescriptors.push(privateEditor);
        // Descriptor for the public scenes where the user is and editor
        var publicEditorFilter = { editors: Meteor.userId(), private: false };
        var publicEditor = {categoryTitle: "Public Scenes where I am an Editor", searchFilter: publicEditorFilter };
        categoryDescriptors.push(publicEditor);
        // Descriptor for the other public scenes
        var publicOtherFilter = { $and: [
            { ownerId: { $ne: Meteor.userId() } },
            { editors: { $ne: Meteor.userId() } }
         ] };
        var publicOther = {categoryTitle: "Public Scenes ", searchFilter: publicOtherFilter };
        categoryDescriptors.push(publicOther);
        return categoryDescriptors;
    }
}); 