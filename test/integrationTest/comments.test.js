import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for comments controller', () => {

    it('should create a user before running tests', async () => {
        const userDetails = {
            username: 'SamDoe',
            password: 'password',
            email: 'samdoe@wemail.com',
            firstName: 'Sam',
            lastName: 'Doe',
            bio: 'sleeps and eat a lot',
        }
        const response = await chai.request(app).post('/api/v1/auth/signup')
            .send(userDetails);
            expect(response.status).to.equal(200);
    });
});
