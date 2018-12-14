import chai from 'chai';
import { authentication } from '../src/utilities';

const { expect } = chai;

const data = {
  id: 2,
  role: 1,
  username: 'helios'
};

describe('valid token should be generated', () => {
  it('it should return a Scrambled token', async () => {
    const token = await authentication.getToken(data);
    expect(token).to.be.a('String');
  });
});

describe('scrambled token should be unscrambled and Validated', () => {
  it('it should unscramble token and validate', async () => {
    const token = await authentication.getToken(data);
    const user = await authentication.verifyToken(token);
    expect(user.id).to.be.equal(2);
    expect(user.role).to.be.equal(1);
    expect(user.username).to.be.equal('helios');
    expect(user).to.be.a('object');
  });
});
