"use client";

import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

type UploadWidgetButtonProps = {
  label: string;
  className?: string;
  replaceMediaId?: string;
};

type UploadInfo = {
  public_id?: string;
  resource_type?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  original_filename?: string;
};

export function UploadWidgetButton({ label, className, replaceMediaId }: UploadWidgetButtonProps) {
  const router = useRouter();

  async function handleSuccess(result: unknown) {
    const data = result as { info?: UploadInfo };
    const info = data?.info;

    if (!info?.public_id) return;

    await fetch("/api/admin/media/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicId: info.public_id,
        resourceType: info.resource_type,
        format: info.format,
        width: info.width,
        height: info.height,
        bytes: info.bytes,
        folder: info.folder,
        originalFilename: info.original_filename,
        replaceMediaId: replaceMediaId || null,
      }),
    });

    router.refresh();
  }

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sdnturi2"}
      options={{
        sources: ["local", "camera", "url"],
        multiple: false,
        resourceType: "auto",
      }}
      onSuccess={(result) => {
        void handleSuccess(result);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          className={className || "btn-primary"}
          onClick={() => open()}
        >
          {label}
        </button>
      )}
    </CldUploadWidget>
  );
}
