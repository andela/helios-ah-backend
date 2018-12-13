import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../src/app';
import models from '../src/models';
import Authenticate from '../src/middleware/Authorization';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { authentication } from '../src/utilities';

let dataUserId;

chai.use(chaiHttp);
chai.use(sinonChai);

const { expect } = chai;
const { Users } = models;

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
  describe('Test to signup a user', () => {
    it('should create a user', (done) =>{
      const userDetails = {
        username: 'JohnDoe',
        password: 'password',
        email: 'johndoe@wemail.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Fun to be with. Cool and calm',
      }
      chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).to.deep.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.not.equal(null);
        expect(res.body.message).to.equal("User JohnDoe created successfully");
        expect(res.body).to.have.property('username');
        expect(res.body.username).to.not.equal(null);
        expect(res.body.username).to.equal('JohnDoe');
        expect(res.body).to.have.property('email');
        expect(res.body.email).to.not.equal(null);
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.not.equal(null);
        dataUserId = res.body.id;
        done();
      });
    });
    it('should return an error when any user details is not given', (done) =>{
      const userDetails = {
        username: 'JohnDoe',
        password: 'password',
        email: 'johndoe@wemail.com',
        firstName: 'John',
        bio: 'Fun to be with. Cool and calm',
      }
      chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).to.deep.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Invalid request. All fields are required');
        done();
      });
    });
  });
  describe('Test to get Users', () => {
    let token;
    before(async () => {
      token = await authentication.getToken({
        role: 2
      });
      for (let index = 0; index < 10; index++) {
        let user = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: '123456',
          bio: faker.lorem.paragraph(),
          username: faker.name.firstName(),
          isVerified: true,
        }
        try {
         await Users.create(user);
        } catch (error) {
          throw error;
        }
      }
    });
    it('should get all users', async () => {
      const response = await chai.request(app).get('/api/v1/authors')
      .set('x-access-token', token);
      expect(response.status).to.be.equals(200);
      expect(response.body.success).to.be.equals(true);
      expect(response.body.authors).to.be.an('array');
    });
    it('should get all users where search matches like username, firstname, lastname', async () => {
      const response = await chai.request(app).get('/api/v1/authors/?search=john')
      .set('x-access-token', token);
      expect(response.status).to.be.equals(200);
      expect(response.body.success).to.be.equals(true);
      expect(response.body.authors).to.be.an('array');
    });
    it('should reject unauthorize user', async () => {
      const request = {
        decoded: {
          id: 1
        },
        body: {
          userId: 2
        }
      }

      const response = {
        status () {},
        send (args) { return args; }
      }

      const next = sinon.stub();
      sinon.stub(response, 'status').returnsThis();
      
      const result = await Authenticate.hasWriteAccess(request, response, next);
      
      expect(response.status).to.be.calledOnce;
      expect(response.status).to.be.calledWith(401);
      expect(result).to.have.property('message', 'You don\'t have access to edit this file');
    });
  });
});

describe('Tests for roles', () => {
  let validAdminToken, invalidAdminToken, newRole, invalidRole;
  before(async () => {
    validAdminToken = await authentication.getToken({
      role: 2
    });
    invalidAdminToken = await authentication.getToken({
      role: 1
    });
    newRole = {
      roleId: 2
    };
    invalidRole = {
      roleId: 'invalid role'
    }
  });
  describe('Validation for role update', () => {
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
  describe('Integration test for roles controller', () => {
    it('should update user role', async () => {
      const res = await chai.request(app).put(`/api/v1/users/role/${dataUserId}`)
        .set('x-access-token', validAdminToken).send(newRole);
      expect(res.status).to.deep.equal(200);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('User role was updated successfully');
      expect(res.body).to.have.property('success');
      expect(res.body.success).to.equal(true);
    });
  });
});
