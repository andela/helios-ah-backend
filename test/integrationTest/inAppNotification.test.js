import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';


chai.use(chaiHttp);
const { expect } = chai;

const user = {
  email: 'yomizy@wizzy.com',
  password: 'myPassword'
}

let token;
let decodedUserToken;

  describe('Integration tests for notifications', () => {
    before('login before running tests', async () => {
      const response = await chai.request(app).post('/api/v1/auth/login')
      .send(user);
      token = response.body.userDetails.token;
    });
    describe('GET: /api/v1/notifications/app', () => {
    it('should throw an error if there is no token provided', async () => {
      try {
        const res = await chai.request(app)
            .get('/api/v1/notifications/app')

        expect(res.status).to.deep.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User not authorized')
        expect(res.body).to.have.property('code');
        expect(res.body.code).to.equal(401)
      } catch (err) {
        throw err;
      }
    });
    it('should throw an error if there is an invalid token provided', async () => {
      try {
      
        const invalidToken = `${token}21djxdw`

        const res = await chai.request(app)
        .get('/api/v1/notifications/app')
        .set('x-access-token', invalidToken)

        expect(res.status).to.deep.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Authentication failed')
        expect(res.body).to.have.property('code');
        expect(res.body.code).to.equal(401)
      } catch (err) {
        throw err;
      }
    });
    it('should opt for in app notifications', async () => {
      const loginDetails = {
        email: 'tonyboy@andela.com',
        password: 'password'
      }
      try {
        const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(loginDetails)


        const userToken = await res.body.userDetails.token

        expect(res.status).to.deep.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Login successful');

        const res2 = await chai.request(app)
        .get('/api/v1/notifications/app')
        .set('x-access-token', userToken)


        expect(res2.status).to.deep.equal(200);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('You have subscribed for in app notifications')
      } catch (err) {
        throw err;
      }
    });
    it(`should throw an error if user tries to subscribe for in app notifications 
    and they are already subscribed`, async () => {
      const loginDetails = {
        email: 'mike@myzone.com',
        password: '12345'
      }
      try {
        const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(loginDetails)


        const userToken = await res.body.userDetails.token

        expect(res.status).to.deep.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Login successful');

        const res2 = await chai.request(app)
        .get('/api/v1/notifications/app')
        .set('x-access-token', userToken)


        expect(res2.status).to.deep.equal(200);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('You have subscribed for in app notifications')

        const res3 = await chai.request(app)
        .get('/api/v1/notifications/app')
        .set('x-access-token', userToken)

        expect(res3.status).to.deep.equal(400);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('You are already subscribed for in app notifications')

      } catch (err) {
        throw err;
      }
    });
  });



  describe('DELETE: /api/v1/notifications/app', () => {
    it('should throw an error if there is no token provided', async () => {
      try {
        const res = await chai.request(app)
            .delete('/api/v1/notifications/app')

        expect(res.status).to.deep.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User not authorized')
        expect(res.body).to.have.property('code');
        expect(res.body.code).to.equal(401)
      } catch (err) {
        throw err;
      }
    });
    it('should throw an error if there is an invalid token provided', async () => {
      try {
      
        const invalidToken = `${token}21djxdw`

        const res = await chai.request(app)
        .delete('/api/v1/notifications/app')
        .set('x-access-token', invalidToken)

        expect(res.status).to.deep.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Authentication failed')
        expect(res.body).to.have.property('code');
        expect(res.body.code).to.equal(401)
      } catch (err) {
        throw err;
      }
    });
    it('should opt out of in app notifications', async () => {
      try {
        const res = await chai.request(app)
        .delete('/api/v1/notifications/app')
        .set('x-access-token', token)
      
        expect(res.status).to.deep.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('You have unsubscribed from in app notifications')
      } catch (err) {
        throw err;
      }
    });
    it(`should throw an error if user tries to unsubscribe from in app notifications 
    and they are already unsubscribed`, async () => {
      const loginDetails = {
        email: 'tonyboy@andela.com',
        password: 'password'
      }
      try {
        const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(loginDetails)


        const userToken = await res.body.userDetails.token

        expect(res.status).to.deep.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Login successful');

        const res2 = await chai.request(app)
        .delete('/api/v1/notifications/app')
        .set('x-access-token', userToken)


        expect(res2.status).to.deep.equal(200);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('You have unsubscribed from in app notifications')

        const res3 = await chai.request(app)
        .delete('/api/v1/notifications/app')
        .set('x-access-token', userToken)

        expect(res3.status).to.deep.equal(400);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('You are not subscribed for in app notifications')

      } catch (err) {
        throw err;
      }
    });
  });
});
