// ############################
// ########## Global ##########
// ############################

import { Meteor } from 'meteor/meteor';

Projects = new Mongo.Collection('projects');

//Users = new Mongo.Collection('users');

Meteor.startup(() => {
  // code to run on server at startup
});

// #############################
// ########## Publish ##########
// #############################

Meteor.publish("projects", function(){
	return Projects.find();
});

// #############################
// ########## Methods ##########
// #############################

Meteor.methods({
	addAdministrator: function(userId){
		Roles.addUsersToRoles(userId, ['Administrator'] );
	},
	addUser: function(userId){
		Roles.addUsersToRoles(userId, ['User']);
	},
	addProject: function(title, subject, markup, techs){
		var proj = Projects.insert({
			title: title,
			subject: subject,
			text: markup,
			techs: techs
		});

		return proj;
	},
	updateProject: function(id, title, subject, markup, techs){
		var proj = Projects.update({ _id: id }, {
			title: title,
			subject: subject,
			text: markup,
			techs: techs
		});
		console.log("proj", id);
		return id;
	},
	pushImageToProject: function(projId, img){
		Projects.update(projId, {$push: {"images": img}});
	},
	pushHeaderToProject: function(projId, header){
		Projects.update(projId, {$set: {"header": header}});
	},
	removeProject: function(id){
		Projects.remove({_id: id});
	}
});

// ##############################
// ########## Accounts ##########
// ##############################

//First user is added to administrator group, rest to regular user group.
Accounts.onCreateUser(function (options, user) {
    var userId = user._id = Random.id();
    var count = Meteor.users.find().count();
    var handle = Meteor.users.find({_id: userId}, {fields: {_id: 1}}).observe({
        added: function () {
        	if(count > 0){
            	Roles.addUsersToRoles(userId, ['User']);
            } else {
            	Roles.addUsersToRoles(userId, ['Administrator']);
            }
            handle.stop();
            handle = null;
        }
    });

    // In case the document is never inserted
    Meteor.setTimeout(function() {
        if (handle) {
            handle.stop();
        }
    }, 30000);

    return user;
});
