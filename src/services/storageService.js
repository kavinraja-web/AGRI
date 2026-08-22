import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Uploads a produce image to the Supabase storage bucket 'produce-images'
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadProduceImage(file) {
  if (!isSupabaseConfigured() || !supabase) {
    // If Supabase is not configured, return an Unsplash fallback image or object URL
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `produce/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('produce-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('produce-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload produce image:', error);
    throw error;
  }
}
