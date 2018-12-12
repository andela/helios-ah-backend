import sinon from 'sinon';
import chai from 'chai';
import { UserController } from '../../src/controller';
import { authentication, cryptData } from '../../src/utilities';
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
  }
}

const res = {
  status() {
    return this;
  },
  send(obj) {
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
      const spyVerifyToken = sinon.spy(authentication, 'verifyToken');
      const response = await UserController.completeRegistration(req, res);
      expect(spyVerifyToken.called).to.equal(true);
      expect(response.success).to.equal(false);
      expect(response.message).to.equal(
        'Could not complete your registration. Please re-register.'
      );
      spyVerifyToken.restore();
    });
    it('should send a success message when registration is complete', async() => {
      const stubVerifyToken = sinon.stub(authentication, 'verifyToken').returns(true);
      const stubFindByPk = sinon.stub(Users, 'findByPk').returns(foundUser);
      const stubGetToken = sinon.stub(authentication, 'getToken')
      .returns('myRandomStringToken');
      const response = await UserController.completeRegistration(req, res);
      expect(response.success).to.equal(true);
      expect(response.message).to.equal('User myUserName created successfully');
      expect(response.id).to.equal('dccd8ee7-bc98-4a8e-a832-ca116c5fff0a');
      expect(response.username).to.equal('myUserName');
      expect(response.email).to.equal('userUpdated@email.com');
      expect(response.token).to.equal('myRandomStringToken');
      stubVerifyToken.restore();
      stubFindByPk.restore();
      stubGetToken.restore();
    });
  });
  describe('Test internal server error of signup method', () => {
    it('should send internal server error ', async () => {
      const stubEncryptData = sinon.stub(cryptData, 'encryptData').throws({
        error: { message: 'An error occurred during hashing password'}
      });
      const response =  await UserController.userSignup(req, res);
      expect(response.success).to.equal(false);
      expect(response.message).to.equal('Internal server error');
      stubEncryptData.restore();
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
});
