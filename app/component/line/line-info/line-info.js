'use strict';

//require('./_line.scss');

module.exports = {
  template: require('./line-info.html'),
  controller: ['$log', 'lineService', LineInfoController],
  controllerAs: 'lineInfoCtrl',
  bindings: {
    line: '<',
  },
};

function LineInfoController($log, lineService){
  $log.debug('init lineInfoCtrl');

  this.updateLine = function() {
    lineService.updateLine(this.line, this.line._id);
  };

  this.deleteLine = function() {
    lineService.deleteLine(this.line, this.line._id, this.project._id);
  };

}