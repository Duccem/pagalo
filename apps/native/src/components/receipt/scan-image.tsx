import { useImageUploader } from "@/lib/uploadthing";
import { useState } from "react";
import { Alert, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ClientUploadedFileData } from "uploadthing/types";

const ScanImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
    onBeforeUploadBegin: (files) => {
      console.log("Files ready to upload: ", files);
      setImage((files[0] as any).uri);
      return files;
    },
  });

  const handleTakePhoto = async () => {
    const data = await openImagePicker({
      source: "camera", // or "camera"
      onInsufficientPermissions: () => {
        ImagePicker.requestCameraPermissionsAsync();
      },
    });
    console.log((data as ClientUploadedFileData<any>[])[0].ufsUrl);
  };

  const handleUploadGallery = async () => {
    openImagePicker({
      source: "library", // or "camera"
      onInsufficientPermissions: () => {
        ImagePicker.requestCameraPermissionsAsync();
      },
    });
  };
  return <View className="flex-1 items-center justify-start py-10"></View>;
};

export default ScanImage;

