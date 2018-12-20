import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for report article', () => {
    let articleAuthorToken;
    let reporterToken;
    let articleId;
    const authorDetails = {
        email: 'yomizy@wizzy.com',
        password: 'myPassword'
    }
    const reporterDetails = {
        password: 'password',
        email: 'janedoereporter@wemail.com'
    }
    const articleDetails = {
        title: 'The brown fox jump over the frog',
        body: 'the lion saw it',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com'
    };
    before('Create users and article before running tests', async () => {
        const createAuthor = await chai.request(app).post('/api/v1/auth/login')
        .send(authorDetails);
        articleAuthorToken = createAuthor.body.userDetails.token;
        const createReporter = await chai.request(app).post('/api/v1/auth/login')
        .send(reporterDetails);
        reporterToken = createReporter.body.userDetails.token;
        const createArticle = await chai.request(app).post('/api/v1/articles')
            .set('x-access-token', articleAuthorToken).send(articleDetails);
        articleId = createArticle.body.articleCreated.id
    });
    describe('Tests for reporting an article', () => {
        it('should report a plagiarised article', async () => {
            const reportDetails = {
                type: 'plagiarism',
                reportComment: 'my work was plagiarised in the second paragraph of this article',
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/report`)
                .set('x-access-token', reporterToken).send(reportDetails);
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(true);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Report created successfully');
            expect(response.body).to.have.property('reportCreated');
            expect(response.body.reportCreated).to.have.property('plagiarism');
            expect(response.body.reportCreated.plagiarism).to.equal(true);
            expect(response.body.reportCreated).to.have.property('userId');
            expect(response.body.reportCreated).to.have.property('articleId');
            expect(response.body.reportCreated.articleId).to.equal(articleId);
            expect(response.body.reportCreated).to.have.property('agreementViolation');
            expect(response.body.reportCreated.agreementViolation).to.equal(false);
            expect(response.body.reportCreated).to.have.property('reportComment');
            expect(response.body.reportCreated.reportComment).to.equal(reportDetails.reportComment);
        });
        it('should report an article that violates agreement', async () => {
            const reportDetails = {
                type: 'agreementViolation',
                reportComment: 'this article violates no-explicit content policy',
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/report`)
                .set('x-access-token', reporterToken).send(reportDetails);
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(true);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Report created successfully');
            expect(response.body).to.have.property('reportCreated');
            expect(response.body.reportCreated).to.have.property('plagiarism');
            expect(response.body.reportCreated.plagiarism).to.equal(false);
            expect(response.body.reportCreated).to.have.property('userId');
            expect(response.body.reportCreated).to.have.property('articleId');
            expect(response.body.reportCreated.articleId).to.equal(articleId);
            expect(response.body.reportCreated).to.have.property('agreementViolation');
            expect(response.body.reportCreated.agreementViolation).to.equal(true);
            expect(response.body.reportCreated).to.have.property('reportComment');
            expect(response.body.reportCreated.reportComment).to.equal(reportDetails.reportComment);
        });
        it('should return error for invalid type', async () => {
            const reportDetails = {
                type: 'lagiarism',
                reportComment: 'my work was plagiarised in the second paragraph of this article',
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/report`)
                .set('x-access-token', reporterToken).send(reportDetails);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('type is required and must be \'plagiarism\' or \'agreementViolation\'');
        });
        it('should return error for undefined reportComment', async () => {
            const reportDetails = {
                type: 'plagiarism'
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/report`)
                .set('x-access-token', reporterToken).send(reportDetails);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('reportComment field is required');
        });
    });
});
