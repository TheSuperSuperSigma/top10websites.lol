const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB in bytes

if (!IMGBB_API_KEY) {
  console.error('ImgBB API key not found in environment variables');
}

export async function uploadImage(file) {
  if (!file) return null;
  if (!IMGBB_API_KEY) throw new Error('ImgBB API key not configured');
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 32MB limit');
  }
  
  try {
    const base64String = await fileToBase64(file);
    const formData = new FormData();
    formData.append('image', base64String);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    
    return data.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}


