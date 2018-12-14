
import chai from 'chai';
import models from '../../src/models';

const { expect } = chai;
const { Users } = models;
const obj = {
  failedFirstName: {
    firstName: 'john15',
    lastName: 'doe',
    email: 'example@gmail.com',
    password: '123456',
    username: 'john134'
  },
  failedLastName: {
    firstName: 'john',
    lastName: 'do1234',
    email: 'example@gmail.com',
    password: '123456',
    username: 'john134'
  },
  failedEmail: {
    firstName: 'john',
    lastName: 'doe',
    email: '123@gmail.c',
    password: '123456',
    username: 'john134'
  },
  failedPassword: {
    firstName: 'john',
    lastName: 'doe',
    email: 'example@gmail.com',
    password: '12345',
    username: 'john134'
  },
  failedUsername: {
    firstName: 'john',
    lastName: 'doe',
    email: 'example@gmail.com',
    password: '123456',
    username: '_abc'
  },
  pass: {
    firstName: 'john',
    lastName: 'doe',
    email: 'example@gmail.com',
    password: '123456',
    username: 'john134'
  },
  failedDuplicateEmail: {
    firstName: 'john',
    lastName: 'doe',
    email: 'example@gmail.com',
    password: '123456',
    username: 'mike42'
  },
  failedDuplicateUser: {
    firstName: 'john',
    lastName: 'doe',
    email: 'example4@gmail.com',
    password: '123456',
    username: 'john134'
  },
};

describe('Test user model', () => {
  it('should reject first name containing invalid characters', async () => {
    try {
      expect(await Users.create(obj.failedFirstName))
        .to.equal('First name must contain only Alphabets');
    } catch (error) {
      expect(error.errors[0].message)
        .to.equal('First name must contain only Alphabets');
    }
  });

  it('should reject last name containing invalid characters', async () => {
    try {
      expect(await Users.create(obj.failedLastName))
        .to.equal('Last name must contain only Alphabets');
    } catch (error) {
      expect(error.errors[0].message)
        .to.equal('Last name must contain only Alphabets');
    }
  });

  it('should reject email address', async () => {
    try {
      expect(await Users.create(obj.failedEmail))
        .to.equal('Email must be a valid email ID');
    } catch (error) {
      expect(error.errors[0].message)
        .to.equal('Email must be a valid email ID');
    }
  });

  it('should reject password character less than 6', async () => {
    try {
      expect(await Users.create(obj.failedPassword))
        .to.equal('Password must be more than 5 characters');
    } catch (error) {
      expect(error.errors[0].message)
        .to.equal('Password must be more than 5 characters');
    }
  });

  it('should reject username containing invalid characters', async () => {
    try {
      expect(await Users.create(obj.failedUsername)).to.equal(
        'Username must contain only alphabet, numbers, and characters /n'
        + 'and must begin with an alphabet'
      );
    } catch (error) {
      expect(error.errors[0].message)
        .to.equal(
          'Username must contain only alphanumeric'
        );
      }
  });

  it('should save user with valid credentials', async () => {
    try {
      expect(await Users.create(obj.pass)).to.be.an('object');
    } catch (error) {
      expect(error.errors[0].message).to.equal(null);
    }
  });

  it('should reject duplicate email', async () => {
    try {
      expect(await Users.create(obj.failedDuplicateEmail)).to.be.an('object');
    } catch (error) {
      expect(error.errors[0].message).to.equal('email must be unique');
    }
  });

  it('should reject duplicate username', async () => {
    try {
      expect(await Users.create(obj.failedDuplicateUser)).to.be.an('object');
    } catch (error) {
      expect(error.errors[0].message).to.equal('username must be unique');
    }
  });
});
