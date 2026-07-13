import cloudinary from "../lib/cloudinary.js";

export const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result!.secure_url);
      },
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const fileName = imageUrl.split("/").pop()?.split(".")[0];

    if (!fileName) {
      throw new Error("Invalid Cloudinary URL");
    }

    const publicId = `products/${fileName}`;

    const response = await cloudinary.uploader.destroy(publicId);

    if (response.result !== "ok" && response.result !== "not found") {
      throw new Error(`Cloudinary delete failed: ${response.result}`);
    }
  } catch (error) {
    console.error("Cloudinary delete error", error);
    throw error;
  }
};
