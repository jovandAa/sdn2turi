"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

type UploadInfo = {
  public_id?: string;
};

type PublicIdUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

export function PublicIdUploadField({ name, label, defaultValue, required }: PublicIdUploadFieldProps) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
        placeholder="sdn-turi2/..."
        required={required}
      />
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sdnturi2"}
        options={{
          sources: ["local", "camera", "url"],
          multiple: false,
          resourceType: "auto",
        }}
        onSuccess={(result) => {
          const data = result as { info?: UploadInfo };
          const publicId = data?.info?.public_id;
          if (publicId) setValue(publicId);
        }}
      >
        {({ open }) => (
          <button type="button" className="btn-outline mt-2 w-fit" onClick={() => open()}>
            Upload via Popup
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
