'use strict';

let { describe, it, expect } = global; // used to import from Jest

import User from './user.model';
import UserFactory from './user.factory';

// MOSTLY WORKING
describe('User Model', function() {
  let mockUser;
  
  beforeAll(function(done) {
    User.remove({}, () => done());
  });

  beforeEach(function(done) {
    mockUser = new User(UserFactory.build());
    done();
  });

  afterEach(function(done) {
    User.remove({}, () => done());
  });

  /* TESTS */

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      expect(users.length).toEqual(0);
      done();
    });
  });

  it('should create a valid user', function(done) {
    User.create(mockUser, function(err, user) {
      if(err) done(err);
      expect(user).toBeTruthy();
      done();
    })
  });

  it('should fail when saving a duplicate user', async (done) => {
    console.log('mockUser --> ', mockUser);
    const user = await mockUser.save();
    console.log('firstEntry --> ', user);
    try {
      const dup = await mockUser.save();
    } catch(err) {
      console.log('err -->', err);
      expect(err).toBeTruthy();
      done();
    }

    /*mockUser.save(function(err, user) {
      expect(err).toBeFalsy();
      expect(user).toBeTruthy();
      mockUser.save(function(err, user) {
        expect(err).toBeTruthy();
        done();
      });
    });*/
  });

  it('should fail when saving without an email', function(done) {
    mockUser.email = '';
    mockUser.save(function(err) {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should fail if the email is improperly formatted', function(done) {
    mockUser.email = 'test';
    mockUser.save(function(err) {
      expect(err).toBeTruthy();
      done();
    });
  });

  it("should authenticate user if password is valid", function(done) {
    expect(mockUser.authenticate('password')).toBe(true);
    done();
  });

  it("should not authenticate user if password is invalid", function(done) {
    expect(mockUser.authenticate('blah')).toBe(false);
    done();
  });
});
