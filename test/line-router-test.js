'use strict';

require('./lib/test-env.js');

const projectMock = require('./lib/project-mock.js');
const lineMock = require('./lib/line-mock.js');
// const userMock = require('./lib/user-mock.js');
const cleanUpDB = require('./lib/clean-up-mock.js');

const Project = require('../model/project.js');
const Cage = require('../model/cage.js');

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server.js');
const serverControl = require('./lib/server-control.js');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleLineData = {
  name: 'cree',
  genes: ['piper', 'bowles', 'isadog'],
};

describe('testing line router', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDB(done));

  describe('testing POST /api/project/:projId/line', function() {
    describe('with valid body', function() {
      //to post a line, have to have a project to post to
      before(done => projectMock.call(this, done));

      it('should return a line and add line to projects line array ', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          Project.findById(this.tempProject._id)
          .then(project => {
            expect(project.lines.length).to.equal(1);
          });
          done();
        });
      }); //end of it should return a line
    });

    describe('with invalid body', function() {
      before(done => projectMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send({poop: 'ypants'})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      }); //end of it should return a 400 bad request
    }); //end of describe with invalid body

    describe('with no name', function() {
      before(done => projectMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send({genes: ['well', 'hello', 'there']})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no array of genes', function() {
      before(done => projectMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send({name: 'prungs'})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no body', function() {
      before(done => projectMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send({})
        .set('Content-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: 'Bearer 1234'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: 'Bearer '})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid project id', function() {
      before(done => projectMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/project/98765/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //end of describe testing POST

  describe('testing GET /api/project/projId/line/lineId', function() {

    describe('with valid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a line', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.projectId).to.equal(`${this.tempProject._id}`);
          done();
        });
      });
    });

    describe('with invalid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/1234`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //end of describe testing GET

  describe('testing DELETE /api/project/:projId/line/:lineId', function() {
    describe('with valid projectId and valid lineId', function() {
      before(done => lineMock.call(this, done));

      it('should delete the line and the line from the lines array of the project, and all dependencies (cages and mice)', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          // add the following lines back in as soon as you make the cage model
          Cage.findById({lineId: `${this.tempLine._id}`})
            .catch(err => {
              expect(err.name).to.equal('CastError');
              expect(res.status).to.equal(204);
              expect(parseInt(`${this.tempProject.lines.length}`)).to.equal(0);
              done();
            });
        });
      });
    });

    describe('with valid projectId and invalid lineId', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid projectId and valid lineId', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.delete(`${url}/api/project/1234/line/${this.tempLine._id}`)
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
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: 'Bearer nope'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid auth header', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: 'try again'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of DELETE tests

  describe('testing PUT /api/project/:projId/line/:lineId', function() {
    describe('with valid line id, updated name', function() {
      before(done => lineMock.call(this, done));

      it('should return an updated line with updated name', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({name: 'newLine'})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('newLine');
          done();
        });
      });
    });

    describe('with valid line id, updated genes', function() {
      before(done => lineMock.call(this, done));

      it('should return an updated line with updated genes', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({genes: ['new', 'array', 'ofgenes']})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('piper');
          expect(res.body.genes[0]).to.equal('new');
          expect(res.body.genes[1]).to.equal('array');
          expect(res.body.genes[2]).to.equal('ofgenes');
          done();
        });
      });
    });

    describe('with valid line id, invald body', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .send('wrong')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with invalid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/prungsters`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Content-Type', 'application/json')
        .send({
          name: 'hi',
          lines: ['oh', 'hai'],
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: 'Bearer '})
        .set('Content-Type', 'application/json')
        .send({
          name: 'hi',
          lines: ['oh', 'hai'],
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: 'Bearer 8888'})
        .set('Content-Type', 'application/json')
        .send({
          name: 'hi',
          lines: ['oh', 'hai'],
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => lineMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.put(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set('Content-Type', 'application/json')
        .send({
          name: 'hi',
          lines: ['oh', 'hai'],
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of PUT
});
