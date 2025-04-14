import { createClient } from "@/utils/supabase/client";

export const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const supabase = createClient();

  try {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("image-upload-gitdates")
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("image-upload-gitdates").getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};
