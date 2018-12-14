import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src/app';
import { UserController } from '../../src/controller';
import { Authentication } from '../../src/utilities';

chai.use(chaiHttp);
const { expect } = chai;
describe('Integration tests for the user controller', () => {
  describe('Test general error handling and welcome message', () => {
    it('should send an error when there is an unforseen error', (done) => {
      const userDetails = {
        username: 'Thomas?',
        password: 'tomnjerry',
      };
      chai.request(app).post('/api/v1/auth/signup/%')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.error).to.have.property('message');
          done();
        });
    });
    it('should send a "Page not found" error when invalid URL is given', (done) => {
      chai.request(app).get('/api/v1/some/funny/url')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('The page you are looking for is not found');
        done();
      });
    });
    it('should welcome the user to the Author\'s-Haven API', (done) => {
      chai.request(app).get('/api/v1/')
      .end((err, res) => {
        expect(res.status).to.deep.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Welcome to the Authors-Haven API');
        done();
      });
    });
  });
  describe('Test to pre-signup a user', () => {
    it('should create a user and send email for verification', async () =>{
      const userDetails = {
        id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
        username: 'JthnDoes',
        password: 'password',
        email: 'johndoe@wemail.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Fun to be with. Cool and calm',
        }
      const stubCreateTokenAndSendEmail = sinon.stub(
        UserController, 'createTokenAndSendEmail').returns(true);
      const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        'An email has been sent to your email address.'
        + 'Please check your email to complete your registration');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.be.equal(true);
      stubCreateTokenAndSendEmail.restore();
    });
    it('should return an error when any user details is not given', async () =>{
      const userDetails = {
        username: 'JohnDoe',
        password: 'password',
        email: 'johndoe@wemail.com',
        firstName: 'John',
        bio: 'Fun to be with. Cool and calm',
      }
      const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails)
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Invalid request. All fields are required');
    });
  });
  describe('Tests for user roles', () => {
    let validAdminToken, invalidAdminToken, newRole, invalidRole, dataUserId;
    before(async () => {
      validAdminToken = await Authentication.getToken({
        role: 2
      });
      invalidAdminToken = await Authentication.getToken({
        role: 1
      });
      newRole = {
        roleId: 2
      };
      invalidRole = {
        roleId: 'invalid role'
      }
    });
    describe('Test for Validation of role update', () => {
      it('should return an error for an invalid token', async () => {
        const res = await chai.request(app).put(`/api/v1/users/role/${dataUserId}`)
          .set('x-access-token', invalidAdminToken).send(newRole);
        expect(res.status).to.deep.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Invalid token. Only Admins. can update roles');
      });
      it('should return an error for an invalid or empty role', async () => {
        const res = await chai.request(app).put(`/api/v1/users/role/${dataUserId}`)
          .set('x-access-token', validAdminToken).send(invalidRole);
        expect(res.status).to.deep.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Invalid role passed');
      });
    });
  });
  describe('Test response when user tries to reset password', () => {
    it('should return an error message when invalid token is sent', async () => {
      const response = await chai.request(app).put('/api/v1/change/password?token=someToken').send({
        email: 'johndoe@wemail.com',
        password: 'LongLiveAndela'
      });
      expect(response.status).to.eql(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Authentication failed');
    });
  });
  describe('Test response for requesting for password reset', () => {
    it('should return status code 200 and an object', async () => {
      const email = { email: 'johndoe@wemail.com' }
      const response = await chai.request(app).post('/api/v1/user/requests/password/reset')
        .send(email);
      expect(response.status).to.deep.equal(200);
      expect(response.body.message).to.eql(
        'check your mail for instructions on how to reset password'
      )
    });
    it('should return status code 404 and an object', async () => {
      const email = { email: 'emailNotFound@wfemail.com' }
      const response = await chai.request(app).post('/api/v1/user/requests/password/reset')
        .send(email);
      expect(response.status).to.deep.equal(404);
      expect(response.body.error).to.eql(
        'user not found'
      )
    });
  })
});
