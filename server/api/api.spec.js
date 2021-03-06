/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

describe('User routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/users/', () => {
    const buffyEmail = 'buffy@purrbook.com'
    const buffyPassword = '1234'

    beforeEach(() => {
      return User.create({
        password: buffyPassword,
        email: buffyEmail
      })
    })

    it('GET /api/users', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body[0].email).to.be.equal(buffyEmail)
    })
  }) // end describe('/api/users')
}) // end describe('User routes')


describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../');
  });
  afterEach(function () {
    server = require('../');
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
});
