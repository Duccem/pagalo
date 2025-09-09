import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { uploadFiles, useImageUploader } from "@/lib/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

export default function TabTwoScreen() {
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
  return (
    <View className="flex-1 items-center justify-center">
      <View className="mb-4 h-[400px]  w-[280px] overflow-hidden  items-center justify-center rounded-2xl border-2  border-violet-700">
        <Image
          source={{ uri: image! }}
          resizeMode="cover"
          className="w-full h-full"
        />
      </View>

      <View className="flex-row gap-5">
        <TouchableOpacity
          className="rounded-full bg-blue-500 px-4 py-2"
          onPress={handleTakePhoto}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white">Take Photo</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full bg-blue-500 px-4 py-2"
          onPress={handleUploadGallery}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white">Upload Image</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

