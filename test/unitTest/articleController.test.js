import sinon from 'sinon';
import chai from 'chai';
import { ArticleController } from '../../src/controller';
import models from '../../src/models';
import app from '../../src/app';

const { Article } = models;
const { expect } = chai;
const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  }
}
const articleDetails = {
  title: 'The brow fox',
  body: 'so i saw a dog',
  description: 'narrative',
  image: 'https://someimage.uplodersite.com',
};
let articleId;
describe('Unit test for the Article controller', () => {
  before('Create token to validate routes, then create article', async () => {
    const userDetails = {
      email: 'yomizy@wizzy.com',
      password: 'myPassword',
    }
    let response = await chai.request(app).post('/api/v1/auth/login')
      .send(userDetails);
    const myToken = response.body.userDetails.token;
    response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails);
    articleId = response.body.articleCreated.id;
  });
  describe('Test that all methods of the article controller class are available', () => {
    it('should check if createArticle exists', () => {
      expect(ArticleController.createArticle).to.exist;
    });
    it('should check if createArticle is a method', () => {
      expect(ArticleController.createArticle).to.be.a('function');
    });
    it('should check if updateArticle exists', () => {
      expect(ArticleController.updateArticle).to.exist;
    });
    it('should check if updateArticle is a method', () => {
      expect(ArticleController.updateArticle).to.be.a('function');
    });
    it('should check if getArticle exists', () => {
      expect(ArticleController.getArticles).to.exist;
    });
    it('should check if getArticle is a method', () => {
      expect(ArticleController.getArticles).to.be.a('function');
    });
    it('should check if getArticleById exists', () => {
      expect(ArticleController.getArticleById).to.exist;
    });
    it('should check if getArticleById is a method', () => {
      expect(ArticleController.getArticleById).to.be.a('function');
    });
    it('should check if bookmarkArticle exists', () => {
      expect(ArticleController.bookmarkArticle).to.exist;
    });
    it('should check if bookmarkArticle is a method', () => {
      expect(ArticleController.bookmarkArticle).to.be.a('function');
    });
  });
  describe('Test internal server error of getArticleById method', () => {

    it('should send internal server error', async () => {
      const stubFindByPkMethod = sinon.stub(Article, 'findByPk').throws({
        'error': 'Some Crazy Error thrown by stub',
      });
      const req = {
        params: {
          articleId: '3e3e1ba7-3e2c-4c3d-a793-bab88af5fbbb',
        }
      };
      const response = await ArticleController.getArticleById(req, res);
      expect(response.success).to.equal(false);
      expect(response.message).to.equal('Internal server error');
      stubFindByPkMethod.restore();
    });
    it('should send success message when a user tries to get an article', async () => {
      const article = {
        update: () => { },
        dataValues: {
          viewStats: 3
        }
      };
      const stubFindByPkMethod = await sinon.stub(Article, 'findByPk').returns(article);
      const req = {
        params: {
          articleId
        }
      };
      const response = await ArticleController.getArticleById(req, res);
      expect(response.success).to.equal(true);
      expect(response).to.have.property('article');
      stubFindByPkMethod.restore();
    });
  });
});
