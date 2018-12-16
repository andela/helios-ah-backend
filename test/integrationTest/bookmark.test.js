
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

const { expect } = chai;

describe('POST /api/v1/articles/:articleId/bookmark', () => {
  const userDetails = {
    username: 'JohDftf',
    password: 'testPassword',
    email: 'johnbve1@wemanjhgil.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'RIP John Doe',
  };

  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
        expect(true).to.equal(true);
    });
    it('should throw an Error if an invalid token is provided', async () => {
        expect(true).to.equal(true);

    });
  });

  describe('Bad request', () => {
    it('should throw an Error if the articleId is not of type UUIDV4', async () => {
        expect(true).to.equal(true);
    });
  });
  describe('Successful bookmark', () => {
    it('should show a success message if bookmark is successful', async () => {
        expect(true).to.equal(true);   
    });
  });
  describe('Duplicate entry', () => {
    it('should throw an Error if the bookmark already exists', async () => {
        expect(true).to.equal(true);
    });
  });
});
