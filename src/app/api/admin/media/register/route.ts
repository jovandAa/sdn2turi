import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

type RegisterBody = {
  publicId?: string;
  resourceType?: "image" | "video" | string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  folder?: string | null;
  originalFilename?: string | null;
  replaceMediaId?: string | null;
};

function toMediaType(resourceType?: string) {
  return resourceType === "video" ? "VIDEO" : "IMAGE";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as RegisterBody;

  if (!body.publicId) {
    return NextResponse.json({ error: "publicId required" }, { status: 400 });
  }

  if (body.replaceMediaId) {
    const current = await prisma.mediaAsset.findUnique({ where: { id: body.replaceMediaId } });

    if (!current) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    await prisma.mediaAsset.update({
      where: { id: body.replaceMediaId },
      data: {
        publicId: body.publicId,
        resourceType: toMediaType(body.resourceType),
        format: body.format || null,
        width: body.width || null,
        height: body.height || null,
        bytes: body.bytes || null,
        folder: body.folder || null,
        altText: body.originalFilename || current.altText || null,
      },
    });

    if (current.publicId !== body.publicId) {
      await cloudinary.uploader.destroy(current.publicId, {
        resource_type: current.resourceType === "VIDEO" ? "video" : "image",
        invalidate: true,
      });
    }

    return NextResponse.json({ ok: true });
  }

  await prisma.mediaAsset.upsert({
    where: { publicId: body.publicId },
    update: {
      resourceType: toMediaType(body.resourceType),
      format: body.format || null,
      width: body.width || null,
      height: body.height || null,
      bytes: body.bytes || null,
      folder: body.folder || null,
      altText: body.originalFilename || null,
    },
    create: {
      publicId: body.publicId,
      resourceType: toMediaType(body.resourceType),
      format: body.format || null,
      width: body.width || null,
      height: body.height || null,
      bytes: body.bytes || null,
      folder: body.folder || null,
      altText: body.originalFilename || null,
    },
  });

  return NextResponse.json({ ok: true });
}
