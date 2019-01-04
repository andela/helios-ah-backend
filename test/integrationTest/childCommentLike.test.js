import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for like childcomment and update childcomment like status', () => {
    let userToken;
    const unlikedCommentId = '09808443-8e79-49e5-acca-5a42ff6b425d',
        likedCommentId = '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
        nonExistingCommentId = 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
        updateCommentId = '781063b9-92be-4d9a-8699-fdac9227f32c'
    const userDetails = {
        email: 'yomizy@wizzy.com',
        password: 'password'
    }
    before('Login a user before running tests', async () => {
        const createAuthor = await chai.request(app).post('/api/v1/auth/login')
            .send(userDetails);
        userToken = createAuthor.body.userDetails.token;
    });
    describe('Tests for liking a childComment', () => {
        it('should like a childComment', async () => {
            const response = await chai.request(app).post(`/api/v1/childComments/${unlikedCommentId}/likes`)
                .set('x-access-token', userToken);
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(true);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Comment liked successfully');
            expect(response.body).to.have.property('childCommentId');
            expect(response.body.childCommentId).to.equal(`${unlikedCommentId}`);
            expect(response.body).to.have.property('isLiked');
            expect(response.body.isLiked).to.equal(true);
        });
        it('should not like a childComment that is already liked', async () => {
            const response = await chai.request(app).post(`/api/v1/childComments/${likedCommentId}/likes`)
                .set('x-access-token', userToken)
            expect(response.status).to.equal(409);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Comment already liked');
        });
        it('should not like a childComment that does not exist', async () => {
            const response = await chai.request(app).post(`/api/v1/childComments/${nonExistingCommentId}/likes`)
                .set('x-access-token', userToken)
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Comment does not exist');
        });
    });
    describe('Tests for updating the like status of childcomment', () => {
        it('should update like status of a comment', async () => {
            const response = await chai.request(app).put(`/api/v1/childComments/${updateCommentId}/likes`)
                .set('x-access-token', userToken).send({like: 'false'});
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(true);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Comment like status updated successfully');
            expect(response.body).to.have.property('isLiked');
            expect(response.body.isLiked).to.equal('false');
        });
        it('should not update a like status that does not exist', async () => {
            const response = await chai.request(app).put(`/api/v1/childComments/${'bab8afd4-e7a2-4f78-93ee-a940111f27fe'}/likes`)
                .set('x-access-token', userToken).send({like: 'false'})
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('like status to be updated not found');
        });
        it('should not update a like status with wrong input type', async () => {
            const response = await chai.request(app).put(`/api/v1/childComments/${nonExistingCommentId}/likes`)
                .set('x-access-token', userToken)
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('like is required and must be a boolean');
        });
    });
});
