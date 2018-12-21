import sinon from 'sinon';
import chai from 'chai';
import './'
import { UserController } from '../../src/controller';
import { Authentication, sendEmail } from '../../src/utilities';
import models from '../../src/models';

const { Users } = models;
const { expect } = chai;

const req = {
  query: {
    token: 'someFakeToken',
  },
  body: {
    username: 'yeah',
    password: 'myPassword',
    email: 'myemail@wemail.com',
    firstName: 'myFirstName',
    lastName: 'myLastName',
    roleId: '2',
  },
  params: {
    userId: '4323432',
  },
  decoded: {
    id: '2343-34564-34565-45-44-54er5t54'
  }
}

const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  }
}

const foundUser = {
  update() {
    return {
      id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
      username: 'myUserName',
      email: 'userUpdated@email.com',
      token: 'myTokenCreated',
    };
  }
}

describe('Unit test for user controller', () => {
  describe('Test all methods of the class are available', () => {
    it('userSignup should be a method', () => {
      expect(UserController.userSignup).to.be.a('function');
    });
    it('should exist a method called completeRegistration', () => {
      expect(UserController.completeRegistration).to.exist;
    });
    it('should exist a method called userSignup ', () => {
      expect(UserController.userSignup).to.exist;
    });
    it('should be a method completeRegistration', () => {
      expect(UserController.completeRegistration).to.be.a('function');
    });
    it('should be a method userRole', () => {
    expect(UserController.userRole).to.be.a('function');
    });
    it('should exist a method called userRole', () => {
      expect(UserController.userRole).to.exist;
    });
  });
  describe('Test complete a user\'s registration', () => {
    it('should send error message when token is invalid', async () => {
      const stubFindByPk = sinon.stub(Users, 'findByPk').returns(false);
      const response = await UserController.completeRegistration(req, res);
      expect(stubFindByPk.called).to.equal(true);
      expect(response.success).to.equal(false);
      expect(response.message).to.equal(
        'Could not complete your registration. Please re-register.'
      );
      stubFindByPk.restore();
    });
    it('should send a success message when registration is complete', async() => {
      const stubFindByPk = sinon.stub(Users, 'findByPk').returns(foundUser);
      const stubGetToken = sinon.stub(Authentication, 'getToken')
      .returns('myRandomStringToken');
      const stubSendEmail = sinon.stub(sendEmail, 'confirmRegistrationComplete')
      .returns(true);
      const response = await UserController.completeRegistration(req, res);
      expect(response.success).to.equal(true);
      expect(response.message).to.equal('User myUserName created successfully');
      expect(response.id).to.equal('dccd8ee7-bc98-4a8e-a832-ca116c5fff0a');
      expect(response.username).to.equal('myUserName');
      expect(response.token).to.equal('myRandomStringToken');
      stubFindByPk.restore();
      stubGetToken.restore();
      stubSendEmail.restore();
    });
  });
  describe('Test internal server error of signup method', () => {
    it('should send internal server error ', async () => {
      const stubFindOneMethod = sinon.stub(Users, 'findOne').throws({
        'error': 'some random error',
      });
      const response =  await UserController.userSignup(req, res);
      expect(response.success).to.equal(false);
      expect(response.message).to.equal('Internal server error');
      stubFindOneMethod.restore();
    });
  });
  describe('Test for updating a user\'s role', () => {
    it('should send a message on successful role update', async () => {
      const stubUpdateMethod = sinon.stub(Users, 'update').returns([1]);
      const response = await UserController.userRole(req, res);
      expect(response.success).to.be.equal(true);
      expect(response).to.have.property('message');
      expect(response.message).to.equal('User role was updated successfully');
      stubUpdateMethod.restore();
    });
  });
  describe('Test for logging in a user', () => {
    const myReq = { body: { email: 'email', password: 'password' } };
    const myRes = { status() {return this; }, json(obj) { return obj; } };
    it('should send a failed message when email does not exist', async () => {
      const stubFindOne = sinon.stub(Users, 'findOne').returns(false);
      const response = await UserController.userLogin(myReq, myRes);
      expect(response).to.have.property('success');
      expect(response).to.have.property('message');
      expect(response.success).to.equal(false);
      expect(response.message).to.equal('Email or password does not exist');
      stubFindOne.restore();
    });
    it('should send a failed message when password is invalid', async () => {
      const stubVerifyPassword = sinon
      .stub(Users.prototype, 'verifyPassword').returns(false);
      const response = await UserController.userLogin(myReq, myRes);
      expect(response).to.have.property('success');
      expect(response).to.have.property('message');
      expect(response.success).to.equal(false);
      expect(response.message).to.equal('Email or password does not exist');
      stubVerifyPassword.restore();
    });
    it('should check if the user is verified before logging in the user',
    async () => {
      const stubFindOne = sinon.stub(Users, 'findOne').returns({isVerified: false});
      const response = await UserController.userLogin(myReq, myRes);
      expect(response).to.have.property('success');
      expect(response).to.have.property('message');
      expect(response.success).to.equal(false);
      expect(response.message).to
      .equal('You had started the registration process already. '
      + 'Please check your email to complete your registration.');
      stubFindOne.restore();
    });
  });
});
