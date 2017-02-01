'use strict';

require('./_new-cage.scss');

module.exports = {
  template: require('./new-cage.html'),
  controller: ['$log', '$http', '$rootScope', '$scope', 'cageService',  NewCageController],
  controllerAs: 'newCageCtrl',
  bindings: {
    project: '<',
    line: '<',
  },
};

function NewCageController($log, $http, $rootScope, $scope, cageService){
  $log.debug('init newCageCtrl');

  console.log('the current line in the new cage controller', this.line);
  console.log('the current project in the new cage controller', this.project);

  this.cage = {};
  this.line = {};

  // this.pickDate = function() {
  //   $log.debug('init pickDate');
  //   this.datetimepicker();
  // };

  this.createNewCage = function(){
    $log.debug('init createNewCage()');
    cageService.createCage(this.cage, this.project._id, this.line._id)
    .then((cage) => {
      $log.debug('the cage just created', cage);
    });
  };

  this.deleteCage = function(cage){
    $log.debug('init deleteCage()');
    cageService.deleteCage(cage)
    .then(() => {
      $log.debug('deleted cage');
    });
  };

  // this.fetchCages = function() {
  //   $log.debug('init fetchCages()');
  //   cageService.fetchCages(this.lineData)
  //   .then(data => {
  //     this.cages = data;
  //   });
  // };

  $rootScope.$on('$locationChangeSuccess', () => {
    this.fetchCages();
  });

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true,
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1,
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.open3 = function() {
    $scope.popup3.opened = true;
  };

  $scope.open4 = function() {
    $scope.popup4.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false,
  };

  $scope.popup2 = {
    opened: false,
  };

  $scope.popup3 = {
    opened: false,
  };

  $scope.popup4 = {
    opened: false,
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full',
    },
    {
      date: afterTomorrow,
      status: 'partially',
    },
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

  // this.fetchCages();
}
