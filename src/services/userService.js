
// ─── Dependencies ─────────────────────────────────────────────

import User from "../models/userModel.js";
import ms from 'ms';
import { verifyToken, hashPassword, generateVerificationToken } from "../utils/authUtils.js";
import { createUserInstance } from "../factory/userFactory.js";
import { findUserByUsernameOrEmail } from './queries/userQueries.js';

// ─── Environment Variables ─────────────────────────────────────────────

const verificationTokenExpiry = ms(process.env.VERIFICATION_TOKEN_EXPIRY);
const SHOULD_CREATE_AS_ADMIN = process.env.CREATE_ADMIN === 'true';

// ─── User Services ─────────────────────────────────────────────
  
export async function findUserByTokenService(token) {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded._id);
    if (!user) 
        throw new Error('User not found');
    return user;
}

export async function findUserByIdService(id) {
    const user = await User.findById(id);
    if (!user) 
        throw new Error('User not found');
    return user;
}

export async function updateUserService(id, userDetails) {
    if (userDetails.password) 
        userDetails.password = await hashPassword(userDetails.password);

    const currentUser = await User.findById(id)
    if (!currentUser) 
        throw new Error('User not found');

    const isEmailUpdated = userDetails.email && userDetails.email !== currentUser.email;
    const user = await User.findByIdAndUpdate(id, userDetails, { new: true });
    if (!user) 
        throw new Error('User not found');

    const verificationToken = generateVerificationToken(user._id);
    if (isEmailUpdated) {
        user.verification.isVerified = false
        user.verification.verificationToken = verificationToken
        user.verification.verificationTokenExpires = Date.now() + verificationTokenExpiry
    }
    await user.save();
    return user;
}

// ─── Media Services ─────────────────────────────────────────────

// export async function uploadUserDocumentsService(id, documents = []) {
//   return await uploadAttachments(User, id, documents, 'documents', 'document');
// }

// export async function uploadProfilePictureService(id, profilePic) {
//     return await uploadAttachments(User, id, profilePic, 'profilePic', 'image'); 
// }

// export async function deleteAllUserDocumentsService(id) {
//   return await deleteAllAttachments(User, id, 'documents');
// }

// export async function deleteSingleUserDocumentService(id, fileId) {
//   return await deleteSingleAttachment(User, id, fileId, 'documents');
// }

// export async function CreateUnitService(unitDetails, unitImg = []) {
//   const existingUnit = await Unit.findOne({ unitNumber: unitDetails.unitNumber });
//   if (existingUnit) {
//     throw new Error('Unit with this number already exists');
//   }

//   const uploadedImages = await uploadLooseAttachments(unitImg, 'image');

//   const unit = new Unit({
//     unitNumber: unitDetails.unitNumber,
//     floorLevel: unitDetails.floorLevel,
//     unitType: unitDetails.unitType,
//     unitOccupants: unitDetails.unitOccupants,
//     currentOccupants: 0,
//     unitDescription: unitDetails.unitDescription,
//     unitPrice: unitDetails.unitPrice,
//     unitStatus: 'Available',
//     images: uploadedImages.map(({ url, fileId }) => ({ imageUrl: url, fileId })),
//     dateCreated: new Date(),
//   });

//   await unit.save();
//   return unit;
// }


// ─── Admin User Services ─────────────────────────────────────────────

export async function createUserService(userDetails) {
    const existingUser = await findUserByUsernameOrEmail( userDetails.username, userDetails.email )
    if (existingUser) throw new Error('Username or email already exists');

    const hashedPassword = await hashPassword(userDetails.password);
    const user = createUserInstance(userDetails, { createAdmin: SHOULD_CREATE_AS_ADMIN, hashedPassword })
    await user.save();
}

export async function findAllUsersService() {
    const users = await User.find({});
    if (!users) throw new Error('No users found');
    return users;
}

export async function findUsersLoggedInService() {
    const users = await User.find({ "loginInfo.isLoggedIn": true });
    if (!users) throw new Error('No users found');
    return users;
}

export async function deleteUserService(id, cleanupHandlers = []) {
    const user = await User.findByIdAndDelete(id);
    if (!user) 
        throw new Error('User not found');

    for (const handler of cleanupHandlers)
        await handler(user)
    return true
}

