
// ─── Dependencies ─────────────────────────────────────────────

import User from "../models/userModel.js";
import ms from 'ms';

// ─── Environment Variables ─────────────────────────────────────────────

const verificationTokenExpiry = ms(process.env.VERIFICATION_TOKEN_EXPIRY);

// ─── User Instances ─────────────────────────────────────────────

export function createUserInstance(userDetails, options = {}) {
    const {
        createAdmin = false,
        hashedPassword,
        verificationToken = null
    } = options;

    const userType = createAdmin ? 'admin' : userDetails.userType || 'user';

    const userPayload = {
        firstName:      userDetails.firstName,
        lastName:       userDetails.lastName,
        gender:         userDetails.gender || 'Not provided',
        email:          userDetails.email,
        phone:          userDetails.phone || 'Not provided',
        username:       userDetails.username,
        password:       hashedPassword,
        userType:       userType
    };
    if (verificationToken) {
        userPayload.verification = {
            isVerified: false,
            verificationToken,
            verificationTokenExpires: Date.now() + verificationTokenExpiry
        };
    }
    return new User(userPayload);
}