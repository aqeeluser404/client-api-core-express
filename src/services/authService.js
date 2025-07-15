
// ─── Dependencies ─────────────────────────────────────────────

import User from "../models/userModel.js";
import ms from 'ms';
import { 
    generateVerificationToken, 
    comparePassword, 
    generateAuthToken, 
    hashPassword
} from "../utils/authUtils.js";
import { createUserInstance } from '../factory/userFactory.js';
import { findUserByUsernameOrEmail } from './queries/userQueries.js';
// import { verifyEmail } from '../utils/emailService.js';

// ─── Environment Variables ─────────────────────────────────────────────

const verificationTokenExpiry = ms(process.env.VERIFICATION_TOKEN_EXPIRY);
const SHOULD_CREATE_AS_ADMIN = process.env.CREATE_ADMIN === 'true';

// ─── Auth Services ─────────────────────────────────────────────
  
export async function registerUserService(userDetails) {
    const existingUser = await findUserByUsernameOrEmail( userDetails.username, userDetails.email )
    if (existingUser) throw new Error('Username or email already exists');

    const hashedPassword = await hashPassword(userDetails.password);
    const user = createUserInstance(userDetails, { createAdmin: SHOULD_CREATE_AS_ADMIN, hashedPassword, verificationToken: null })
    await user.save();

    const verificationToken = generateVerificationToken(user._id);
    user.verification.isVerified = false;
    user.verification.verificationToken = verificationToken;
    user.verification.verificationTokenExpires = Date.now() + verificationTokenExpiry;
    // await verifyEmail(user);
    return user;
}

export async function loginUserService(username, email, password) {
    const user = await findUserByUsernameOrEmail(username, email)
    if (!user) throw new Error('User not found');

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = generateAuthToken(user);
    return token;
}

export async function logoutUserService(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found')
    await user.logout()
    return 'User logged out successfully';
} 