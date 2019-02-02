import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.should();
chai.use(chaiHttp);

const { expect } = chai;

let userToken, articleId, userLoginResponse, postArticleResponse, articleId2;

describe('POST /api/v1/articles/:articleId/bookmark', () => {
  before(async () => {
    const userDetails = {
      email: 'tonyboy@andela.com',
      password: 'password',
    };

    userLoginResponse = await chai.request(app)
      .post('/api/v1/auth/login')
      .send(userDetails);
    userToken = userLoginResponse.body.userDetails.token;


    const articleDetails = {
      description: 'A short story about the best article ever',
      body: 'This is the best article, ever!',
      title: 'The best article',
      image: 'https://someimage.uplodersite.com',
    };

    postArticleResponse = await chai.request(app)
      .post('/api/v1/articles')
      .send(articleDetails)
      .set('x-access-token', userToken);

    articleId = postArticleResponse.body.articleCreated.id;

    const postArticleResponse2 = await chai.request(app)
      .post('/api/v1/articles')
      .send(articleDetails)
      .set('x-access-token', userToken);

    articleId2 = postArticleResponse2.body.articleCreated.id;

  });
  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      try {
        expect(userLoginResponse.status).to.equal(200);
        expect(userLoginResponse.body).to.have.property('success');
        expect(userLoginResponse.body).to.have.property('message');
        expect(userLoginResponse.body).to.have.property('userDetails');

        expect(postArticleResponse.status).to.equal(201);
        expect(postArticleResponse.body).to.have.property('message');
        expect(postArticleResponse.body.message).to.equal('Article created successfully');

        const bookmarkResponse = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`);
        expect(bookmarkResponse.status).to.equal(401);
        expect(bookmarkResponse.body).to.have.property('message');
        expect(bookmarkResponse.body.message).to.equal('User not authorized');
      } catch (err) {
        throw err;
      }
    });
    it('should throw an Error if an invalid token is provided', async () => {
      try {
        expect(userLoginResponse.status).to.equal(200);
        expect(userLoginResponse.body).to.have.property('success');
        expect(userLoginResponse.body).to.have.property('message');
        expect(userLoginResponse.body).to.have.property('userDetails');

        expect(postArticleResponse.status).to.equal(201);
        expect(postArticleResponse.body).to.have.property('message');
        expect(postArticleResponse.body.message).to.equal('Article created successfully');

        const invalidToken = `${userToken}21djxdw`;
        const bookmarkResponse = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', invalidToken);

        expect(bookmarkResponse.status).to.equal(401);
        expect(bookmarkResponse.body).to.have.property('message');
        expect(bookmarkResponse.body.message).to.equal('Authentication failed');
      } catch (err) {
        throw err;
      }
    });
  });

  describe('Bad request', () => {
    it('should throw an Error if the articleId is not of type UUIDV4', async () => {
      try {
        expect(userLoginResponse.status).to.equal(200);
        expect(userLoginResponse.body).to.have.property('success');
        expect(userLoginResponse.body).to.have.property('message');
        expect(userLoginResponse.body).to.have.property('userDetails');

        expect(postArticleResponse.status).to.equal(201);
        expect(postArticleResponse.body).to.have.property('message');
        expect(postArticleResponse.body).to.have.property('articleCreated');
        expect(postArticleResponse.body.message).to.equal('Article created successfully');

        const bookmarkResponse = await chai.request(app)
          .post('/api/v1/articles/aa1sdds-1223-122/bookmark')
          .set('x-access-token', userToken);

        expect(bookmarkResponse.status).to.equal(400);
        expect(bookmarkResponse.body).to.have.property('message');
        expect(bookmarkResponse.body.message).to.equal('Invalid Id');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Successful bookmark', () => {
    it('should show a success message if bookmark is successful', async () => {
      try {
        expect(userLoginResponse.status).to.equal(200);
        expect(userLoginResponse.body).to.have.property('success');
        expect(userLoginResponse.body).to.have.property('message');
        expect(userLoginResponse.body).to.have.property('userDetails');

        expect(postArticleResponse.status).to.equal(201);
        expect(postArticleResponse.body).to.have.property('message');
        expect(postArticleResponse.body.message).to.equal('Article created successfully');

        const bookmarkResponse = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', userToken);
        expect(bookmarkResponse.status).to.equal(201);
        expect(bookmarkResponse.body).to.have.property('message');
        expect(bookmarkResponse.body.message).to.equal('Article successfully bookmarked');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Get Bookmarks', () => {
    it('should get bookmarks', async () => {
      try {
        const bookmarkResponse = await chai.request(app)
          .get('/api/v1/users/bookmarks')
          .set('x-access-token', userToken);

        expect(bookmarkResponse.status).to.equal(200);
        expect(bookmarkResponse.body).to.have.property('success');
        expect(bookmarkResponse.body.success).to.equal(true);
        expect(bookmarkResponse.body).to.have.property('message');
        expect(bookmarkResponse.body.message).to.equal('Bookmark was found');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Duplicate entry', () => {
    it('should throw an Error if the bookmark already exists', async () => {
      try {
        expect(userLoginResponse.status).to.equal(200);
        expect(userLoginResponse.body).to.have.property('success');
        expect(userLoginResponse.body).to.have.property('message');
        expect(userLoginResponse.body).to.have.property('userDetails');

        const secondTestArticleDetails = {
          description: 'Second test article',
          body: 'This is the second best article, ever!',
          title: 'The second best article',
          image: 'https://secondbestarticle.uplodersite.com',
        };

        const postSecondArticleResponse = await chai.request(app)
          .post('/api/v1/articles')
          .send(secondTestArticleDetails)
          .set('x-access-token', userToken);
        expect(postSecondArticleResponse.status).to.equal(201);
        expect(postSecondArticleResponse.body).to.have.property('message');
        expect(postSecondArticleResponse.body.message).to.equal('Article created successfully');

        const secondArticleId = postSecondArticleResponse.body.articleCreated.id;

        const bookmarkResponse = await chai.request(app)
          .post(`/api/v1/articles/${secondArticleId}/bookmark`)
          .set('x-access-token', userToken);

        expect(bookmarkResponse.status).to.equal(201);
        expect(bookmarkResponse.body).to.have.property('message');
        expect(bookmarkResponse.body.message).to.equal('Article successfully bookmarked');

        const duplicateBookmarkResponse = await chai.request(app)
          .post(`/api/v1/articles/${articleId}/bookmark`)
          .set('x-access-token', userToken);

        expect(duplicateBookmarkResponse.status).to.equal(409);
        expect(duplicateBookmarkResponse.body).to.have.property('message');
        expect(duplicateBookmarkResponse.body.message).to.equal('Bookmark already exists');
      } catch (err) {
        throw err;
      }
    });
  });
  it('should delete bookmarks', async () => {
    try {
      const bookmarkResponse = await chai.request(app)
          .post(`/api/v1/articles/${articleId2}/bookmark`)
          .set('x-access-token', userToken);

      const delBookmark = await chai.request(app)
        .delete(`/api/v1/users/bookmarks/${bookmarkResponse.body.bookmark.articleId}`)
        .set('x-access-token', userToken);
      expect(delBookmark.status).to.equal(200);
      expect(delBookmark.body).to.have.property('message');
      expect(delBookmark.body.message).to.equal('Bookmark deleted successfully');
    } catch (err) {
      throw err;
    }
  });
});
