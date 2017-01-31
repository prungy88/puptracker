'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', '$rootScope','projectService', 'lineService', 'authService', HomeController];

function HomeController($log, $location, $rootScope, projectService, lineService){
  $log.debug('init homeCtrl');

  this.lines = [];
  this.projects = [];
  this.currentProject;

  this.status = {
    isopen1:false,
    isopen2: false,
  };

  console.log('current project', this.currentProject);
  console.log('the projects array', this.projects);
  $log.debug('THE LINES', this.lines);

  this.currentLineCheck = function(){
    lineService.fetchLines(this.project._id);
  };

  this.fetchProject = function(project){
    this.currentProject = project;
    console.log('the current project', this.currentProject);
    lineService.fetchLines(this.currentProject._id);
  };

  this.fetchLine = function(line){
    this.currentLine = line;
    console.log('the current line', this.currentLine);
    // TODO: have cage service fetch the lines
    // cageService.fetchCages(this.currentLine._id);
  };

  this.fetchProjects = function(){
    console.log('THIS SHOULD HAPPEN EVERYTIME I SELECT A PROJECT');
    projectService.fetchProjects()
    .then( projects => {
      this.projects = projects;
      // this.currentProject = projects[0];
      $log.debug('Succesfully found projects', projects);
    });
  };

  this.fetchLines = function(){
    lineService.fetchLines(this.currentProject._id)
    .then( lines => {
      this.lines = lines;
      this.project.lines = lines;
      $log.debug('Succesfully found lines');
    });
  };

  this.fetchProjects();
}
