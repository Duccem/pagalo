import { generateReactNativeHelpers } from "@uploadthing/expo";
import type { OurFileRouter } from "../../../server/src/lib/uploadthing";
import { genUploader } from "uploadthing/client";
export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<OurFileRouter>({
    url: "https://2jphk0dv-3000.use2.devtunnels.ms/api/image/upload",
  });

export const { uploadFiles } = genUploader<OurFileRouter>({
  url: "https://2jphk0dv-3000.use2.devtunnels.ms/api/image/upload",
});

