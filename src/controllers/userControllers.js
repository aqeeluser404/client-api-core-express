
// ─── Dependencies ─────────────────────────────────────────────

import { findUserByTokenService, findUserByIdService, updateUserService, createUserService, findAllUsersService, findUsersLoggedInService, deleteUserService } from "../services/userService.js";
import { sendRaw, sendSuccess } from "../utils/responseUtils.js";
import { handleControllerError } from "../utils/errorUtils.js";
import { deleteUserOrders, deleteUserRentals } from "../services/cleanup/cleanupUser.js";
import { uploadAttachments, deleteAttachments } from "../utils/imagekit/uploadHandler.js";
import { attachmentFieldMap } from "../middleware/multerConfig.js";
import User from "../models/userModel.js";

// ─── User Controllers ─────────────────────────────────────────────

export async function findUserByTokenController(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) throw { statusCode: 401, message: 'Access denied. No token provided.' };
        const user = await findUserByTokenService(token);
        return sendRaw(res, user);
    } catch (err) {
        return handleControllerError(res, err);
    }
}

export async function findUserByIdController(req, res) {
    try {
        const { id } = req.params;
        const user = await findUserByIdService(id);
        return sendRaw(res, user);
    } catch (err) {
        return handleControllerError(res, err)
    }
}

export async function updateUserController(req, res) {
    try {
        const { id } = req.params;
        const userDetails = req.body;
        await updateUserService(id, userDetails);
        sendSuccess(res, {}, 'User updated successfully');
    } catch (err) {
        return handleControllerError(res, err)
    }
}

// ─── Attachment Controllers ─────────────────────────────────────────────

export async function uploadUserAttachmentController(req, res) {
  try {
    const { id, type: typeKey } = req.params
    const replace = req.query.replace === 'true'
    const config = attachmentFieldMap[typeKey]

    if (!config) throw new Error('Unsupported attachment type')

    const files = config.multiple ? req.files : req.file
    
    console.log('Received files:', req.files)
    console.log('Target field:', config.field)
    console.log('Multiple:', config.multiple)

    const updated = await uploadAttachments(
      User,
      id,
      files,
      config.field,
      config.type,
      config.multiple,
      replace
    )

    sendSuccess(res, updated, `${typeKey} uploaded ${replace ? 'and replaced' : 'successfully'}`)
  } catch (err) {
    handleControllerError(res, err)
  }
}

export async function deleteUserAttachmentController(req, res) {
  try {
    const { id, type: typeKey, fileId } = req.params
    const config = attachmentFieldMap[typeKey]
    if (!config) throw new Error('Unsupported attachment type')

    const updated = await deleteAttachments(
      User,
      id,
      config.field,
      config.type,
      config.multiple,
      fileId // may be null if deleting all
    )

    sendSuccess(res, updated, fileId ? `Deleted file ${fileId}` : `Cleared ${typeKey}`)
  } catch (err) {
    handleControllerError(res, err)
  }
}


// export async function deleteUserAttachmentController(req, res) {
//   try {
//     const userId = req.params.id;
//     const fileId = req.params.fileId;
//     const typeKey = req.params.type;
//     const config = attachmentFieldMap[typeKey];
//     if (!config) 
//         throw new Error('Unsupported attachment type');

//     if (fileId) {
//       await deleteAttachments(User, userId, config.field, fileId);
//       sendSuccess(res, {}, `${typeKey} removed successfully`);
//     } else {
//       await deleteAttachments(User, userId, config.field);
//       sendSuccess(res, {}, `${typeKey} cleared successfully`);
//     }
//   } catch (err) {
//     return handleControllerError(res, err);
//   }
// }

// ─── Admin User Controllers ─────────────────────────────────────────────

export async function createUserController(req, res) {
    try {
        await createUserService(req.body)
        sendSuccess(res, {}, 'User created successfully');
    } catch (err) {
        return handleControllerError(res, err)
    }
}

export async function findAllUsersController(req, res) {
    try {
        const users = await findAllUsersService()
        sendRaw(res, users);
    } catch (err) {
        return handleControllerError(res, err)
    }
}

export async function findUsersLoggedInController(req, res) {
    try {
        const users = await findUsersLoggedInService();
        sendRaw(res, users);
    } catch (err) {
        return handleControllerError(res, err)
    }
}

// export async function findUsersFrequentlyLoggedInController(req, res) {
//     try {
//         const users = await
//         sendSuccess(res, users, 'Users retrieved successfully');
//     } catch (err) {
//         return handleControllerError(res, err)
//     }
// }

export async function deleteUserController(req, res) {
    try {
        const { id } = req.params;

        // add the document/image delete functions
        await deleteUserService(id, [deleteUserOrders, deleteUserRentals]);
        sendSuccess(res, {}, 'User deleted successfully')
    } catch (err) {
        return handleControllerError(res, err)
    }
}




// export async function uploadUserDocumentsController(req, res) {
//     try {
//         const files = req.files;
//         const userId = req.params.id;
//         const uploaded = await userService.uploadUserDocumentsService(userId, files);
//         sendSuccess(res, uploaded, 'Documents uploaded successfully');
//     } catch (err) {
//         return handleControllerError(res, err)
//     }
// }

// export async function uploadProfilePictureController(req, res) {
//   try {
//     const userId = req.params.id;
//     const file = req.file; 
//     const updatedUser = await userService.uploadProfilePictureService(userId, file);
//     sendSuccess(res, updatedUser, 'Profile picture uploaded successfully');
//   } catch (err) {
//     return handleControllerError(res, err);
//   }
// }

// export async function deleteAllUserDocumentsController(req, res) {
//     try {
//         const userId = req.params.id;
//         await userService.deleteAllUserDocumentsService(userId);
//         sendSuccess(res, {}, 'All documents cleared successfully');
//     } catch (err) {
//         return handleControllerError(res, err)
//     }
// }

// export async function deleteSingleUserDocumentController(req, res) {
//     try {
//         const userId = req.params.id;
//         const fileId = req.params.doc;
//         await userService.deleteSingleUserDocumentService(userId, fileId)
//         sendSuccess(res, {}, 'All documents cleared successfully');
//     } catch (err) {
//         return handleControllerError(res, err)
//     }
// }