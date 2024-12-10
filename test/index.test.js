const assert = require('assert');
const request = require('supertest');
const app = require('../index'); // Adjust the path as necessary
describe('Application Tests', () => {
    it('hello world!', () => {
        assert.strictEqual(1 + 1, 2);
    });
});
describe('GET /api/users/:_id/logs', () => {
  let userId;

  before(async () => {
    // Create a user
    const userResponse = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });
    userId = userResponse.body._id;

    // Add exercises to the user
    await request(app)
      .post(`/api/users/${userId}/exercises`)
      .send({ description: 'test exercise', duration: 30, date: '2023-10-01' });
    await request(app)
      .post(`/api/users/${userId}/exercises`)
      .send({ description: 'another exercise', duration: 45, date: '2023-10-02' });
  });

  it('should return logs with date as a string in dateString format', async () => {
    const response = await request(app).get(`/api/users/${userId}/logs`);
    const logs = response.body.log;

    logs.forEach(log => {
      assert.strictEqual(typeof log.date, 'string');
      assert.strictEqual(new Date(log.date).toDateString(), log.date);
    });
    });
});
describe('POST /api/users/:_id/exercises', () => {
  it('should return the user object with the exercise fields added', async () => {
    const userResponse = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });
    const userId = userResponse.body._id;

    const exerciseResponse = await request(app)
      .post(`/api/users/${userId}/exercises`)
      .send({ description: 'test exercise', duration: 30, date: '2023-10-01' });

    assert.strictEqual(exerciseResponse.status, 200);
    assert.strictEqual(exerciseResponse.body.username, 'testuser');
    assert.strictEqual(exerciseResponse.body.description, 'test exercise');
    assert.strictEqual(exerciseResponse.body.duration, 30);
    assert.strictEqual(exerciseResponse.body.date, new Date('2023-10-01').toDateString());
  });
});