// #############################
// ########## Helpers ##########
// #############################

Template.showProjects.helpers({
	rows: function(){
		var i = 1;
		var rows = [];
		var projects = {projects: []};

		var proj = Projects.find({}, {fields: {'images':0}}).fetch();
		var length = proj.length;

		proj.forEach(function(pro){
			projects.projects.push(pro);

			i++;
			if(i % 2 || length < i){
				rows.push(projects);
				projects = {projects: []};
			}
		});

		return rows;
	}
});