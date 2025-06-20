import { createClient } from '@/utils/supabase/client'
import imageCompression from 'browser-image-compression'

export const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const supabase = createClient()

  try {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = e.target.files[0]
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    })

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('image-upload-gitdates')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(error.message || 'Failed to upload image to storage.')
    }

    if (!data?.path) {
      throw new Error('Upload failed - no file path returned.')
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('image-upload-gitdates').getPublicUrl(fileName)

    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image.')
    }

    return publicUrl
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
}
