'use strict';

require('./lib/test-env.js');

//need all the mocks from here up
//clean up DB
const cageMock = require('./lib/cage-mock.js');
const lineMock = require('./lib/line-mock.js');
//const projectMock = require('./lib/project-mock.js');
const cleanUpDB = require('./lib/clean-up-mock.js');

//Line and project models
const Line = require('../model/line.js');
//const Project = require('../model/project.js');

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server.js');
const serverControl = require('./lib/server-control.js');

const mongoose = require('mongoose');
const Promise = require('bluebird');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

let startDate = new Date(2015, 8, 20).toDateString();

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const exampleCageData = {
  name: 'cage2',
  numberOfMales: 1,
  numberOfFemales: 2,
  breedingStartDate: startDate,
  breedingEndDate: new Date(2017, 3, 27).toDateString(),
  expectedDOB: addDays(startDate, 25),
  numberLittersMonthly: 2,
  expectedTotalPups: 6,
  expectedUsablePups: 3,
};

describe('testing cage router', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDB(done));

  describe('testing POST /api/project/:projId/line/:lineId/cage', function() {
    describe('with valid body', function() {
      before(done => lineMock.call(this, done));

      it('should return a cage and add cage to lines cage array', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          Line.findById(this.tempLine._id)
          .then(line => {
            expect(line.cages.length).to.equal(1);
          })
            .catch(err => done(err));
          done();
        });
      });
    });

    describe('with no body', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({})
        .set('Content-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no name', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          // name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no number of males', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          // numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no number of females', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          // numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no breeding start date', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          // breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no breeding end date', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          // breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no expected DOB', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          // expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no number litters monthly', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          // numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no expected total pups', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          // expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with invalid projectId', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/project/1234/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid lineId', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/4747/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer 9867`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .set({Authorization: 'Bearer '})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of POST tests

  describe('testing GET /api/project/:projId/line/:lineId/cage/:cageId', function() {
    describe('with valid project id and valid line id and valid cage id', function() {
      before(done => cageMock.call(this, done));

      it('should return a cage', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.projectId).to.equal(`${this.tempProject._id}`);
          expect(res.body.lineId).to.equal(`${this.tempLine._id}`);
          done();
        });
      });
    });

    describe('with invalid project id and valid line id and valid cage id', function() {
      before(done => cageMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/7890/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with valid project id and invalid line id and valid cage id', function() {
      before(done => cageMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/1234455/cage/${this.tempCage._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with valid project id and valid line id and invalid cage id', function() {
      before(done => cageMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/tryagain`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //end of GET tests

  describe('testing DELETE /api/project/:projId/line/:lineId/cage/:cageId', function() {
    describe('with valid cage id', function() {
      before(done => cageMock.call(this, done));

      it('should delete a cage and the cage from the lines cage array and all dependencies (mice)', (done => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          expect(parseInt(`${this.tempLine.cages.length}`)).to.equal(0);
          done();
        });
      }));
    });

    describe('with invalid cage id', function() {
      before(done => cageMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/wrongid`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer 1234`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: 'Bearer '})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of DELETE tests

  describe('testing PUT /api/project/:projId/line/:lineId/cage/:cageId', function() {
    describe('with valid cageId and updated number of males', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          numberOfMales: 100,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.numberOfMales).to.equal(100);
          done();
        });
      });
    });

    describe('with valid cageId and updated number of females', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          numberOfFemales: 47,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.numberOfFemales).to.equal(47);
          done();
        });
      });

    });

    describe('with valid cageId and updated breeding start date', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          breedingStartDate: new Date(2017, 8, 9),
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.breedingStartDate).to.equal('2017-09-09T07:00:00.000Z');
          done();
        });
      });

    });

    describe('with valid cageId and updated breeding end date', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          breedingEndDate: new Date(2019, 7, 22),
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.breedingEndDate).to.equal('2019-08-22T07:00:00.000Z');
          done();
        });
      });

    });

    describe('with valid cageId and updated expected DOB', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          expectedDOB: new Date(2009, 1, 2),
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.expectedDOB).to.equal('2009-02-02T08:00:00.000Z');
          done();
        });
      });

    });

    describe('with valid cageId and updated number of litters monthly', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          numberLittersMonthly: 1000,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.numberLittersMonthly).to.equal(1000);
          done();
        });
      });

    });

    describe('with valid cageId and updated expected total pups', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          expectedTotalPups: 1000000,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.expectedTotalPups).to.equal(1000000);
          done();
        });
      });

    });

    describe('with valid cageId and updated expected usable pups', function() {
      before(done => cageMock.call(this, done));

      it('should return an updated cage', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          expectedUsablePups: 1,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.expectedUsablePups).to.equal(1);
          done();
        });
      });
    });

    describe('with invalid cageId', function() {
      before(done => cageMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/12`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          numberofMales: 17,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: 'Bearer 233332323'})
        .send({
          numberOfMales: 29,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .set({Authorization: 'Bearer '})
        .send({
          numberOfMales: 29,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}`)
        .send({
          numberOfMales: 29,
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of PUT tests
});
