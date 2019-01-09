import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/app';
import models from '../../src/models';

chai.use(chaiHttp);
const { expect } = chai;
const { Article, Users } = models;
let myToken;

describe('Integration tests for the query article model', () => {
  let articles = [];
  before('populate database with data before running tests', async () => {
    for (let index = 0; index < 5; index++) {
      articles.push({
        title: 'My Andela Journey',
        body: 'Andela is a company that pays you to learn software development...',
        description: 'Andela is located in different parts of the world',
        image: faker.image.imageUrl(),
        isDraft: false,
        userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a'

      });
    }
    await Article.bulkCreate(articles);
  });
  it('should return array of all articles when an invalid query params is passed', async () => {
    const response = await chai.request(app).get('/api/v1/articles?wrongQuery=andela');
    expect(response.status).to.equal(200);
    expect(response.body.articles.length).to.equal(21);
  });
  it('should return array of articles with users whose first name or last name is similar to query string', async () => {
    const response = await chai.request(app).get('/api/v1/articles?author=Doe');
    expect(response.status).to.equal(200);
    expect(response.body.articles.length).to.equal(1);
  });
  it('should return array of articles tagged with the query string', async () => {
    const response = await chai.request(app).get('/api/v1/articles?tag=Technology');
    expect(response.status).to.equal(200);
    expect(response.body.articles.length).to.equal(1);
  });
})
