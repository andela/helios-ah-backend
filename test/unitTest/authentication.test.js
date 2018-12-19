import chai from 'chai';
import { Authentication } from '../../src/utilities';
const { expect } = chai;

let data = {
  id: 'ec0d84a1-4195-4a98-b46c-5976e1839a06',
  role: 1,
  username: 'john134'
}

describe('valid token should be generated', () => {
  it('it should return a Scrambled token', async () => {
    const token = await Authentication.getToken(data);
    expect(token).to.be.a('String');
  });
});

describe('scrambled token should be unscrambled and Validated', () => {
  it('it should unscramble token and validate', async () => {
    const token = await Authentication.getToken(data);
    const user = await Authentication.verifyToken(token);
    expect(user.id).to.be.equal('ec0d84a1-4195-4a98-b46c-5976e1839a06');
    expect(user.role).to.be.equal(1);
    expect(user.username).to.be.equal('john134');
    expect(user).to.be.a('object');
  });
});
