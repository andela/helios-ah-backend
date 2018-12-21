import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.should();
chai.use(chaiHttp);

const { expect } = chai;

let userToken;
let articleId;

describe('POST /api/v1/articles/:articleId/bookmark', () => {
  const userDetails = {
    email: 'tonyboy@andela.com',
    password: 'password',
  };

  const articleDetails = {
    description: 'A short story about the best article ever',
    body: 'This is the best article, ever!',
    title: 'The best article',
    image: 'https://someimage.uplodersite.com',
  };

  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = await res.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .post('/api/v1/articles')
          .send(articleDetails)
          .set('x-access-token', userToken);
        expect(res2.status).to.equal(201);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('Article created successfully');

        const res3 = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`);
        expect(res3.status).to.equal(401);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('User not authorized');
      } catch (err) {
        throw err;
      }
    });
    it('should throw an Error if an invalid token is provided', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = await res.body.userDetails.token;

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .post('/api/v1/articles')
          .send(articleDetails)
          .set('x-access-token', userToken);

        expect(res2.status).to.equal(201);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('Article created successfully');

        const invalidToken = `${userToken}21djxdw`;
        const res3 = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', invalidToken);

        expect(res3.status).to.equal(401);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('Authentication failed');
      } catch (err) {
        throw err;
      }
    });
  });

  describe('Bad request', () => {
    it('should throw an Error if the articleId is not of type UUIDV4', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = res.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .post('/api/v1/articles')
          .set('x-access-token', userToken)
          .send(articleDetails);

        expect(res2.status).to.equal(201);
        expect(res2.body).to.have.property('message');
        expect(res2.body).to.have.property('articleCreated');
        expect(res2.body.message).to.equal('Article created successfully');

        const res3 = await chai.request(app)
          .post('/api/v1/articles/aa1sdds-1223-122/bookmark')
          .set('x-access-token', userToken);

        expect(res3.status).to.equal(400);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('Invalid Id');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Successful bookmark', () => {
    it('should show a success message if bookmark is successful', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = res.body.userDetails.token;

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .post('/api/v1/articles')
          .set('x-access-token', userToken)
          .send(articleDetails);

        expect(res2.status).to.equal(201);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('Article created successfully');
        const articleId = await res2.body.articleCreated.id;

        const res3 = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', userToken);
        expect(res3.status).to.equal(201);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('Article successfully bookmarked');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Duplicate entry', () => {
    it('should throw an Error if the bookmark already exists', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);

        userToken = res.body.userDetails.token;

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .post('/api/v1/articles')
          .set('x-access-token', userToken)
          .send(articleDetails);

        const articleId = await res2.body.articleCreated.id;
        expect(res2.status).to.equal(201);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('Article created successfully');


        const res3 = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', userToken);

        expect(res3.status).to.equal(201);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('Article successfully bookmarked');

        const res4 = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', userToken);

        expect(res4.status).to.equal(409);
        expect(res4.body).to.have.property('message');
        expect(res4.body.message).to.equal('Bookmark already exists');
      } catch (err) {
        throw err;
      }
    });
  });
});
