import type { SupabaseClient } from "@supabase/supabase-js";

type UploadParams = {
  file: File;
  path: string[];
  bucket: string;
};

export const upload = async (
  client: SupabaseClient,
  { file, path, bucket }: UploadParams
) => {
  const storage = client.storage.from(bucket);
  const { error } = await storage.upload(path.join("/"), file, {
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    throw error;
  }

  return storage.getPublicUrl(path.join("/")).data.publicUrl;
};

type RemoveParams = {
  path: string[];
  bucket: string;
};

export const remove = async (
  client: SupabaseClient,
  { bucket, path }: RemoveParams
) => {
  await client.storage
    .from(bucket)
    .remove([decodeURIComponent(path.join("/"))]);
};

type DownloadParams = {
  path: string;
  bucket: string;
};

export async function download(
  client: SupabaseClient,
  { bucket, path }: DownloadParams
) {
  return client.storage.from(bucket).download(path);
}

type ShareParams = {
  path: string;
  bucket: string;
  expireIn: number;
  options?: {
    download?: boolean;
  };
};

export async function share(
  client: SupabaseClient,
  { bucket, path, expireIn, options }: ShareParams
) {
  return client.storage.from(bucket).createSignedUrl(path, expireIn, options);
}

