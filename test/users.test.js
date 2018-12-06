import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../src/app';
import models from '../src/models';
import Authenticate from '../src/middlewares/Authorization';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

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
    before(async () => {
      for (let index = 0; index < 10; index++) {
        let user = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: '123456',
          bio: faker.lorem.paragraph(),
          username: faker.internet.userName(),
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
      const response = await chai.request(app).get('/api/v1/authors');
      expect(response.status).to.be.equals(200);
      expect(response.body.message).to.be.equals('successfully');
      expect(response.body.authors).to.be.an('array');
    });
    it('should get all users where search matches like username, firstname, lastname', async () => {
      const response = await chai.request(app).get('/api/v1/authors/john');
      expect(response.status).to.be.equals(200);
      expect(response.body.message).to.be.equals('successfully');
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
