
// For required fields: always include (required: true)
// For optional fields with defaults: no need to write (required: false), just include (default)
// For optional fields without defaults: just specify the type

// ─── Dependencies ─────────────────────────────────────────────

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// ─── User Schema ─────────────────────────────────────────────
    
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    gender:    { type: String, default: 'Not provided' },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:     { type: String, default: 'Not provided' },
    username:  { type: String, required: true, unique: true, trim: true },
    password:  { type: String, required: true },
    userType:  { type: String, required: true, enum: ['admin', 'user'] },

    verification: {
        isVerified:               { type: Boolean, default: false },
        verificationToken:        { type: String },
        verificationTokenExpires: { type: Date },
    },

    forgotPassword: {
        resetPasswordToken:   { type: String },
        resetPasswordExpires: { type: Date },
    },

    loginInfo: {
        lastLogin:   { type: Date },
        isLoggedIn:  { type: Boolean, default: false },
        loginCount:  { type: Number, default: 0 },
        loginToken:  { type: String }
    },

    location: {
        streetAddress: { type: String, default: 'Not provided' },
        suburb:        { type: String, default: 'Not provided' },
        city:          { type: String, default: 'Not provided' },
        province:      { type: String, default: 'Not provided' },
        postalCode:    { type: String, default: '0000' }
    },

    // ─── Attachments ─────────────────────────────────────────────

    documents: [
      {
        url:          { type: String },
        fileId:       { type: String },
        uploadedAt:   { type: Date },
        type:         { type: String },
        originalName: { type: String }
      }
    ],


    profilePic: {
      url:          { type: String },
      fileId:       { type: String },
      uploadedAt:   { type: Date },
      type:         { type: String },
      originalName: { type: String }
    }

    // ─── Foreign Key Fields ─────────────────────────────────────────────
    
    // orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],    Array
    // organization: { type: Schema.Types.ObjectId, ref: 'Organization' }   Singular

}, {
  collection: 'User',
  timestamps: true
});

// ─── UserSchema Functions ─────────────────────────────────────────────

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;

  if (obj.verification) {
    delete obj.verification.verificationToken;
    delete obj.verification.verificationTokenExpires;
  }
  delete obj.forgotPassword;
  // delete obj.loginInfo?.loginToken;
  delete obj.__v;
  return obj;
};

userSchema.methods.updateLoginStatus = async function(token) {
  this.loginInfo.lastLogin = new Date();
  this.loginInfo.isLoggedIn = true;
  this.loginInfo.loginCount += 1;

  if (this.loginInfo.loginToken !== token) 
    this.loginInfo.loginToken = token;
  return await this.save();
};

userSchema.methods.logout = async function() {
  this.loginInfo.isLoggedIn = false;
  this.loginInfo.loginToken = null;
  await this.save();
};

export default model('User', userSchema);