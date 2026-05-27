import api from './api';

/**
 * Upload an image file to the backend (which stores it on Cloudinary).
 * @param {File} file
 * @param {object} [opts]
 * @param {string} [opts.folder] one of: categories | groups | misc
 * @param {(pct:number)=>void} [opts.onProgress]
 * @returns {Promise<{data:{url:string, publicId:string, width:number, height:number}}>}
 */
export const uploadImage = (file, { folder = 'categories', onProgress } = {}) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/uploads/image', formData, {
    params: { folder },
    // Let the browser set multipart/form-data + boundary (override the JSON default).
    headers: { 'Content-Type': undefined },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
};
