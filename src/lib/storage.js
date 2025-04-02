import { put, del, list, getUrl } from '@vercel/blob';
import JSZip from 'jszip';

/**
 * Upload a file to Vercel Blob Storage
 * @param {File} file - The file to upload
 * @param {String} folder - The folder ID to store the file in
 * @returns {Promise<Object>} - The upload result with URL and other metadata
 */
export async function uploadFile(file, folder) {
  try {
    const blob = await put(`${folder}/${file.name}`, file, {
      access: 'private',
      addRandomSuffix: false,
    });
    
    return blob;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload multiple files to a folder
 * @param {Array<File>} files - Array of files to upload
 * @param {String} folder - The folder ID
 * @returns {Promise<Array>} - Array of upload results
 */
export async function uploadFiles(files, folder) {
  const uploadPromises = files.map(file => uploadFile(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Get a list of files in a folder
 * @param {String} folder - The folder ID
 * @returns {Promise<Array>} - Array of file metadata
 */
export async function listFiles(folder) {
  try {
    const { blobs } = await list({ prefix: `${folder}/` });
    return blobs;
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
}

/**
 * Get a signed URL for a file with limited time access
 * @param {String} url - The blob URL
 * @returns {Promise<String>} - The signed URL for download
 */
export async function getDownloadUrl(url) {
  try {
    return await getUrl(url, {
      expiresIn: 60 * 60, // 1 hour
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Delete a file from storage
 * @param {String} url - The blob URL to delete
 * @returns {Promise<void>}
 */
export async function deleteFile(url) {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Create a zip file from multiple files
 * @param {Array<Object>} files - Array of file data with urls to download
 * @param {String} zipName - Name for the zip file
 * @returns {Promise<Blob>} - Zip file as blob
 */
export async function createZipFromFiles(files, zipName) {
  const zip = new JSZip();
  
  // Add each file to the zip
  for (const file of files) {
    const fileUrl = await getDownloadUrl(file.url);
    const response = await fetch(fileUrl);
    const fileData = await response.blob();
    zip.file(file.pathname.split('/').pop(), fileData);
  }
  
  // Generate the zip file
  const zipContent = await zip.generateAsync({ type: 'blob' });
  return new File([zipContent], zipName, { type: 'application/zip' });
}