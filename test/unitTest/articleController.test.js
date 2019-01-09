import chai from 'chai';
import helperMethods from '../../src/utilities/helperMethods';
import app from '../../src/app';
import ArticleController from '../../src/controller/articlesController';

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
  title: 'fox',
  body: 'so i saw a dog',
  description: 'narrative',
  image: 'https://someimage.uplodersite.com',
};
let articleId, viewStats, title;
describe('Unit test for the Article controller', () => {
  before('Create token to validate routes, then create article', async () => {
    const userDetails = {
      email: 'yomizy@wizzy.com',
      password: 'password',
    }
    let response = await chai.request(app).post('/api/v1/auth/login')
      .send(userDetails);
    const myToken = response.body.userDetails.token;
    response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails);
    articleId = response.body.articleCreated.id;
    viewStats = response.body.articleCreated.viewStats;
    title = response.body.articleCreated.title;
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
    it('should check if bookmarkArticle exists', () => {
      expect(ArticleController.bookmarkArticle).to.exist;
    });
    it('should check if bookmarkArticle is a method', () => {
      expect(ArticleController.bookmarkArticle).to.be.a('function');
    });
  });
  describe('unit test for update view stat helper method', () => {
    it('should test for the update view stat method', async () => {
      const article = await helperMethods.updateViewStat(articleId, viewStats, title);
      expect(article[1][0].dataValues.viewStats).to.eql(1);
    });
  });
});
