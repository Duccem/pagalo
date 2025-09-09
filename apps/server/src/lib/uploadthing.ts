import { createUploadthing, type FileRouter } from "uploadthing/server";
const f = createUploadthing();
export const uploadRouter: FileRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 1,
    },
  })
    .middleware(({ files }) => {
      console.log("FILES", files);
      return { userId: "fakeId" };
    })
    .onUploadComplete((data) => {
      console.log("upload completed", data);
    }),
};
export type OurFileRouter = typeof uploadRouter;

