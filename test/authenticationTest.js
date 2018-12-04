import chai from 'chai';
import { getToken, verifyToken } from '../src/utilities/authentication'
const { expect } = chai;

let data = {
  id: 2,
  role: 1,
  userName: 'helios'
}

describe('valid token should be generated', () => {
  it('it should return a Scrambled token', async() => {
    const token = await getToken(data);
    expect(token).to.be.a('String');
  });
});

describe('scambled token should be unscrambled and Validated', () => {
  it('it should unscramble token and validate', async() => {
    const token = await getToken(data);
    const user = await verifyToken(token);
    console.log(user)
    console.log(user.id)
    expect(user.id).to.be.equal(2);
    expect(user.role).to.be.equal(1);
    expect(user.userName).to.be.equal('helios');
    expect(user).to.be.a('object');
  });
});