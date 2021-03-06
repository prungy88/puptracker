'use strict';

const Mouse = require('../../model/mouse.js');
const debug = require('debug')('puptracker:mouse-mock');

const cageMock = require('./cage-mock.js');


module.exports = function(done) {
  debug('mouse mock for testing');

  let exampleMouse = {
    name: 'emx1-ires-cree;camk2a-tta;ai93-123456',
    geneticMakeup: ['het', 'homo', 'wild'],
    DOB: new Date(2017, 0, 15).toDateString(),
    sex: 'female',
  };

  cageMock.call(this, err => {
    if (err) return done(err);

    exampleMouse.cageId = this.tempCage._id;
    exampleMouse.lineId = this.tempLine._id;
    exampleMouse.projectId = this.tempProject._id;
    new Mouse(exampleMouse).save()
    .then(mouse => {
      this.tempMouse = mouse;
      done();
    })
    .catch(done);
  });
};
