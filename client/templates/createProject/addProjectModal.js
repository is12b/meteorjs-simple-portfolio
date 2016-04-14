// ############################
// ########### vars ###########
// ############################

var images = [];
var header;
var project;
var dep = new Deps.Dependency;

Template.addProjectModal.rendered = function(){
	$('#inputTags').tagsinput({});

	$('#summernote').summernote({
	  height: 300,                 // set editor height
	  minHeight: null,             // set minimum height of editor
	  maxHeight: null,             // set maximum height of editor
	  focus: true                  // set focus to editable area after initializing summernote
	});
}

// #############################
// ########## Helpers ##########
// #############################

Template.addProjectModal.helpers({
	project: function(){
		dep.depend();
		if(typeof project !== 'undefined'){
			return project;
		} else {
			return { images, header };
		}
	},
	hasProject: function(){
		return typeof project !== 'undefined';
	}
});

Template.header.helpers({
	header: function(){
		if(typeof project !== 'undefined'){
			return project.header;
		} else {
			return header;
		}
	}
});

Template.dropzone.helpers({
	dropzone: function(){
		if(typeof project !== 'undefined'){
			return project.images;
		} else {
			return images;
		}
	}
});

// ############################
// ########## Events ##########
// ############################

Template.showProject.events({
	'click .btn-back': function(){
		Router.go('/');
	},
	'click .glyph-proj-edit': function() {
		OpenUpdateModal(this)
	},
	'click .glyph-proj-remove': function(){
		RemoveProject(this);
	}
});

Template.showProjects.events({
	'click .glyph-proj-edit': function() {
		OpenUpdateModal(this)
	},
	'click .glyph-proj-remove': function(){
		RemoveProject(this);
	}
});

Template.header.events({
	'dropped .dropzone': function(e) {
		console.log("Header");
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		var reader = new FileReader();
		reader.onload = function(e) {
			if(typeof project !== 'undefined'){
				project.header = e.target.result;
			} else {
				header = e.target.result;
			}
			dep.changed();
		}
		reader.readAsDataURL(files[0]);
	}
});

Template.dropzone.events({
	'dropped .dropzone': function(e) {
		console.log("Normal");
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		var reader = new FileReader();
		reader.onload = function(e) {
			if(typeof project !== 'undefined'){
				project.images.push(e.target.result);
			} else {
				images.push(e.target.result);
			}
			dep.changed();
		}
		reader.readAsDataURL(files[0]);
	}
});


Template.addProjectModal.events({
	'submit .newProject': function(event, template){
		event.preventDefault();
		var title = event.target.inputTitle.value;
		var subject = event.target.inputSubject.value;
		var techs = event.target.inputTags.value.split(',');
		console.log("techs", techs);
		var markupStr = $('#summernote').summernote('code');

		if(typeof project !== 'undefined'){
			Meteor.call("updateProject", project._id, title, subject, markupStr, techs, function(e, res){
				PushImages(res, project.images, project.header);
			});
		} else {
			Meteor.call("addProject", title, subject, markupStr, techs, function(e, res){
				PushImages(res, images, header);
			});
		}

		Modal.hide(template);
	},
	'click #close': function(event, template){
		images = [];
		project = undefined;
		Modal.hide(template);
	}
});

// ######################################
// ########## Events Functions ##########
// ######################################

PushImages = function (res, imgs, headerImg){
	console.log("res", res);
	imgs.forEach(function(img){
		console.log("res", res);
		Meteor.call("pushImageToProject", res, img);
	});

	Meteor.call("pushHeaderToProject", res, headerImg);

	header = undefined;
	images = [];
	project = undefined;
};

OpenUpdateModal = function(proj){
	project = Projects.findOne({_id: proj._id});
	if(typeof project.images === 'undefined'){
		project.images = images;
	}

	if(typeof project.header === 'undefined'){
		project.header = header;
	}

	Modal.show('addProjectModal', undefined, {
      backdrop: 'static',
      keyboard: false
    });
};

RemoveProject = function(proj){
	Meteor.call("removeProject", proj._id);
};