
let { describe, it, expect } = global;

import app from '../../app';
import request from 'supertest';

// WORKING
describe('GET /api/users', function() {
  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/users/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        expect(res.body.users).toBeInstanceOf(Array);
        done();
      });
  });
});

// ALSO WORKING
describe('POST /api/users', function() {
  test('should create an Admin', async () => {
    const res = await request(app)
                        .post('/api/users/')
                        .send({name: 'admin', email: 'admin@example.com', password: 'foobar1'});
    
    console.log('res --> ', res);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe('admin');
  });

  test('should create an regular User', async () => {
    const res = await request(app)
                        .post('/api/users/')
                        .send({name: 'user', email: 'user@example.com', password: 'user1'});

    console.log('res --> ', res);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe('user');
  });
});


