
import crypto from 'crypto';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    match: [/[A-Za-z0-9]+@([A-Za-z])+(\.[A-Za-z]+)+/, "This email address is not in the correct format. Please enter an email address in the following format: 'example@example.com'."],
  },
  watchlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Watch'
  }], 

  // Authentication
  hashedPassword: String,
  provider: String,
  role: String,
  salt: String,
});

/**
 * Validations
 */

// Validate empty email without using 'required: true' (which would fail when using OAuth)
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true; // always returns 'true' if using OAuth
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password without using 'required: true' (which would fail when using OAuth)
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true; // always returns 'true' if using OAuth
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(email) {
    console.log('email --> ', email);
    mongoose.model('User').findOne({email: email}, (err, user) => {
      console.log('email dup validation --> ', err, user);
      if(err) throw err;
      const outcome = !user;
      console.log('validation outcome --> ', outcome);
      return outcome;
    });
}, 'The specified email address is already in use.');



/**
 * PRE and POST Hooks
 */

const validatePresenceOf = function(value) {
  return value && value.length;
};

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'));
  else
    next();
});

UserSchema.pre('remove', (next) => {
  // remove watches
  //mongoose.model('Watch').
  
  next();
})

/**
 * Instance Methods
 */

UserSchema.methods = {
  /** Authenticate - check if the passwords are the same **/
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /** Generate a cryptographic 'salt' **/
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /** Encrypt password **/
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  }
};


/**
* Virtual Methods
**/

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

UserSchema.set('toJSON',  { virtuals: true });

export default mongoose.model('User', UserSchema);
