'use strict';

module.exports = {
  template: require('./edit-line.html'),
  controller: ['$log', 'lineService', EditLineController],
  controllerAs: 'editLineCtrl',
  bindings: {
    line: '<',
    project: '<',
  },
};

function EditLineController($log, lineService){
  $log.debug('init editLineCtrl');

  this.updateLine = function(){
    $log.debug('editLineCtrl.updateLine()');
    lineService.updateLine(this.project, this.line);
  };
}