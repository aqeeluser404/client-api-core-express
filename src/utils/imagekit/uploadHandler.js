
// ─── Dependencies ─────────────────────────────────────────────

import imageKit from "./imagekitClient.js";

// ─── ImageKit Handlers ─────────────────────────────────────────────

export async function uploadToImageKit(file, type = 'generic') {
  const result = await imageKit.upload({
    file: file.buffer,
    fileName: file.originalname
  })
  return {
    url: result.url,
    fileId: result.fileId,
    uploadedAt: new Date(),
    type,
    originalName: file.originalname,
  }
}

export async function deleteFromImageKit(fileId) {
  await imageKit.deleteFile(fileId);
}

// ─── ImageKit Services ─────────────────────────────────────────────

export async function uploadAttachments(model, id, files, field, type, multiple = false, replace = false) {

  const instance = await model.findById(id)
  if (!instance) throw new Error(`${model.modelName} not found`)

  const filesArray = multiple ? files : [files]
  if (!filesArray || filesArray.length === 0) return instance

  const uploaded = await Promise.all(
    filesArray.map(file => uploadToImageKit(file, type))
  )
  console.log('ImageKit result:', uploaded)

  if (multiple) {
    const formatted = uploaded.map(({ url, fileId, uploadedAt, originalName }) => ({
      url, fileId, uploadedAt, type, originalName
    }))
    instance[field] = replace ? formatted : (instance[field] ?? []).concat(formatted)
  } else {
    const { url, fileId, uploadedAt, originalName } = uploaded[0]

    if (replace && instance[field]?.fileId) {
      try {
        await deleteFromImageKit(instance[field].fileId)
      } catch (err) {
        console.warn(`Failed to delete old file: ${err.message}`)
      }
    }
    instance[field] = { url, fileId, uploadedAt, type, originalName }
  }

  await instance.save()
  return instance
}

// use when adding to a model instance
export async function uploadLooseAttachments(files = [], type = 'generic') {
  if (!Array.isArray(files) || files.length === 0) return [];
  return await Promise.all(files.map(file => uploadToImageKit(file, type)));
}

export async function deleteAttachments(model, id, field, type, multiple = false, fileId = null) {
  const instance = await model.findById(id)
  if (!instance) throw new Error(`${model.modelName} not found`)

  const current = instance[field]

  if (multiple) {
    if (fileId) {
      // Delete specific file from array
      instance[field] = (current ?? []).filter(file => {
        const shouldDelete = file.fileId === fileId
        if (shouldDelete) {
          try {
            deleteFromImageKit(file.fileId)
          } catch (err) {
            console.warn(`Failed to delete fileId: ${file.fileId}`, err)
          }
        }
        return !shouldDelete
      })
    } else {
      // Delete all
      for (const file of current ?? []) {
        try {
          deleteFromImageKit(file.fileId)
        } catch (err) {
          console.warn(`Failed to delete fileId: ${file.fileId}`, err)
        }
      }
      instance[field] = []
    }
  } else {
    // Single value delete
    if (current?.fileId) {
      try {
        await deleteFromImageKit(current.fileId)
      } catch (err) {
        console.warn(`Failed to delete fileId: ${current.fileId}`, err)
      }
    }
    instance[field] = null
  }

  await instance.save()
  return instance
}


// export async function deleteAttachments(model, id, field = 'attachments', fileId = null) {
//   const instance = await model.findById(id);
//   if (!instance) throw new Error('Resource not found');
//   const currentField = instance[field];
//   // Clear all attachments (array or single object)
//   if (!fileId) {
//     if (Array.isArray(currentField)) {
//       const fileIds = currentField.map(item => item.fileId).filter(Boolean);
//       await Promise.all(fileIds.map(deleteFromImageKit));
//       instance[field] = [];
//     } else if (currentField?.fileId) {
//       await deleteFromImageKit(currentField.fileId);
//       instance[field] = null;
//     }
//   }
//   // Delete single item from array field
//   else if (Array.isArray(currentField)) {
//     const index = currentField.findIndex(item => item.fileId === fileId);
//     if (index === -1) throw new Error('Attachment not found');
//     await deleteFromImageKit(fileId);
//     currentField.splice(index, 1);
//   }
//   // Delete single object field if it matches fileId
//   else if (currentField?.fileId === fileId) {
//     await deleteFromImageKit(fileId);
//     instance[field] = null;
//   }
//   await instance.save();
//   return instance;
// }