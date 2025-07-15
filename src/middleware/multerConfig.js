
// ─── Dependencies ─────────────────────────────────────────────

import multer from 'multer';
const storage = multer.memoryStorage();

// ─── Storage Config ─────────────────────────────────────────────

export const upload = multer({ storage });

export const attachmentFieldMap = {
  profilePic: { field: 'profilePic', multiple: false, type: 'image' },
  documents:  { field: 'documents',  multiple: true,  type: 'document' },
  gallery:    { field: 'images',     multiple: true,  type: 'image' }
}
