import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import * as schema from "@/lib/db/schema";
import { supabase } from "@/lib/supabase/client";
import { useColorScheme } from "@/lib/use-color-scheme";
import { decode } from "base64-arraybuffer";
import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ArrowLeft,
  FolderOpenDot,
  ScanEye,
  SwitchCamera,
  Upload,
  X,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Scan() {
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(
    undefined
  );
  const [uploading, setUploading] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <ScreenView>
        <View className="flex-1 items-center justify-center gap-6">
          <View className="w-full flex-row justify-center">
            <TouchableOpacity
              className="flex-row items-center gap-4"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.back();
              }}
            >
              <ArrowLeft
                size={30}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-xl">Back</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-center text-2xl text-muted-foreground px-8">
            We need your permission to show the camera
          </Text>
          <View className="w-full px-8">
            <Button action={requestPermission}>
              <Text className="text-white">Grant permission</Text>
            </Button>
          </View>
        </View>
      </ScreenView>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    const photo = await ref.current?.takePictureAsync({
      quality: 1,
      base64: true,
      exif: false,
    });
    setPhoto(photo);
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPhoto({
        format: (result.assets[0].uri.split(".").pop() || "jpg") as
          | "jpg"
          | "png",
        height: result.assets[0].height || 0,
        width: result.assets[0].width || 0,
        uri: result.assets[0].uri,
        base64: result.assets[0].base64 || undefined,
        exif: result.assets[0].exif,
      });
    }
  }

  async function uploadImage() {
    if (!photo?.base64) return;
    setUploading(true);
    const name = new Date().toISOString() + photo?.format;
    await supabase.storage
      .from("pagalo-receipts")
      .upload(name, decode(photo?.base64 ?? ""), {
        contentType: `image/${photo?.format}`,
      });
    const url = supabase.storage.from("pagalo-receipts").getPublicUrl(name)
      .data.publicUrl;
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SERVER_URL}/api/ai/extract`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: url,
        }),
      }
    );
    const data = await response.json();
    const invoice = await database
      .insert(schema.invoice)
      .values({
        vendor: data.vendor || "Unknown",
        date: data.date || new Date().toISOString().split("T")[0],
        total: data.total || 0,
        tax: data.tax || 0,
        tip: data.tip || 0,
        state: "pending",
      })
      .returning();
    await database.insert(schema.item).values(
      (data.items || []).map((item: any) => ({
        name: item.description || "Unknown",
        price: item.price || 0,
        quantity: item.quantity || 1,
        invoiceId: invoice[0].id,
      }))
    );

    setUploading(false);
    router.replace(`/(receipt)/items?invoice=${invoice[0].id}`);
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={ref} />
      )}
      {uploading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator
            size={30}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </View>
      )}
      <View className="absolute top-12 w-full justify-between items-center flex-row px-6">
        <Button
          action={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.back();
          }}
          variant="white"
          styles={{ borderRadius: 50 }}
        >
          <ArrowLeft
            color={colorScheme === "dark" ? "white" : "black"}
            size={25}
          />
        </Button>
        {photo && (
          <Button
            action={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setPhoto(undefined);
            }}
            variant="white"
            styles={{ borderRadius: 50 }}
          >
            <X color={colorScheme === "dark" ? "white" : "black"} size={25} />
          </Button>
        )}
      </View>

      <View className="absolute bottom-6 w-full px-8 flex-row justify-center">
        {photo && (
          <Button
            action={uploadImage}
            styles={{ borderRadius: 50 }}
            variant="white"
          >
            <Upload
              color={colorScheme === "dark" ? "white" : "black"}
              size={25}
            />
            <Text className="text-lg text-foreground">Upload</Text>
          </Button>
        )}
        {!photo && (
          <>
            <Button
              action={toggleCameraFacing}
              className="p-4 rounded-full"
              styles={{ borderRadius: 50 }}
              variant="white"
            >
              <SwitchCamera
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>
            <Button
              action={takePicture}
              className="p-4 rounded-full"
              styles={{ borderRadius: 50 }}
              variant="white"
            >
              <ScanEye
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>
            <Button
              action={pickImage}
              className="p-4 rounded-full"
              styles={{ borderRadius: 50 }}
              variant="white"
            >
              <FolderOpenDot
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

