// ############################
// ########## Global ##########
// ############################

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import './main.html';

Projects = new Mongo.Collection('projects');

Deps.autorun(function () {
  var current = Router.current();

  Deps.afterFlush(function () {
    $('.content-inner').scrollTop(0);
    $(window).scrollTop(0);
  });
});

// ############################
// ########## Router ##########
// ############################

Router.configure({
  layoutTemplate: 'layout',
  title: 'Portfolio'
});

Router.route('/', {
  template: 'showProjects'
});

Router.route('/about', {
  template: 'about'
});

  template: 'showProject',
  data: function(){ return Projects.findOne({_id: this.params._id}); },
  onBeforeAction: function(){
    var data = this.data();
    if(data){
      var realUrl = "/" + data._id + "/" + slugify(data.title);
      if(this.url.indexOf(realUrl) < 0){
      }
    }

    this.next();
  }
});

// ###############################
// ########## Subscribe ##########
// ###############################

Meteor.subscribe("projects");

// ##############################
// ########## Accounts ##########
// ##############################

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

Template.footer.helpers({
  footer: function(){
    var date = new Date()
    var now = moment(date).format("DD.MM.YYYY");
    var footer = {
      name: "Nick D. Pedersen",
      date: now,
      link: "https://dk.linkedin.com/in/nick-pedersen-90603a43"
    };

    return footer;
  }
});

// ############################
// ########## Events ##########
// ############################

Template.layout.events({
	"click #addProject": function(){
		Modal.show('addProjectModal', undefined, {
      backdrop: 'static',
      keyboard: false
    });
	},
  "click .fancypdf": function(e){
    $.fancybox({
      type: 'html',
      autoSize: false,
      content: '<embed src="'+e.currentTarget.href+'#nameddest=self&page=1&view=FitH,0&zoom=80,0,0" type="application/pdf" height="99%" width="100%" />',
      beforeClose: function() {
        $(".fancybox-inner").unwrap();
      }
    }); //fancybox
   return false;
  }
});



