
// ─── Response Utilities ─────────────────────────────────────────────

// export function sendSuccess(res, data = null, message = '', status = 200) {
//   const response = { success: true };
//   if (message) response.message = message;
//   if (data) response.data = data;
//   return res.status(status).json(response);
// }

// export function sendNoContent(res, message = 'No content') {
//     return res.status(204).end();
// }

export function sendSuccess(res, responseData = {}, message = '', status = 200) {
  return res.status(status).json({
    success: true,
    ...responseData,  
    ...(message && { message }) 
  });
}

export function sendRaw(res, data, status = 200) {
  return res.status(status).json(data);
}

export function sendExists(res, exists, status = 200) {
  return res.status(status).json({ exists });
}

export function sendNotFound(res, message = 'Resource not found', status = 404) {
  return res.status(status).json({ success: false, error: message });
}

export function sendBadRequest(res, message = 'Bad request') {
  return res.status(400).json({ success: false, error: message });
}