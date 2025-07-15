
// ─── Dependencies ─────────────────────────────────────────────

import { Router } from 'express'
// import { verifyJwt, authorizeRoute } from '../../middleware/authentication.js'

import { verifyJwt } from '../../middleware/authentication.js';

import { attachmentFieldMap, upload } from '../../middleware/multerConfig.js'
import {
  findUserByTokenController,
  findUserByIdController,
  updateUserController,
  uploadUserAttachmentController,
  deleteUserAttachmentController
} from '../../controllers/userControllers.js'
const router = Router();

// ─── Middleware ─────────────────────────────────────────────

router.use(verifyJwt);
// router.use(authorizeRoute);

// ─── Routes ─────────────────────────────────────────────
    
router.get('/profile', findUserByTokenController)
router.get('/:id', findUserByIdController)
router.put('/:id', updateUserController)

router.post('/:id/attachments/:type',
  (req, res, next) => {
    const config = attachmentFieldMap[req.params.type]
    if (!config) return res.status(400).send('Invalid type')

    const handler = config.multiple === true ? upload.array('files') : upload.single('file')
    return handler(req, res, next)
  },
  uploadUserAttachmentController
)

router.delete('/:id/attachments/:type/:fileId', deleteUserAttachmentController)

router.delete('/:id/attachments/:type', deleteUserAttachmentController)



export default router


export const userRoutes = { prefix: '/users', router }



// uploadUserDocumentsController,
// uploadProfilePictureController,
// deleteAllUserDocumentsController,
// deleteSingleUserDocumentController

// router.post('/:id/documents', upload.array('documents'), uploadUserDocumentsController)
// router.post('/:id/profile-pic', upload.single('profilePic'), uploadProfilePictureController);
// router.delete('/:id/documents', deleteAllUserDocumentsController)
// router.delete('/:id/documents/:doc', deleteSingleUserDocumentController)

