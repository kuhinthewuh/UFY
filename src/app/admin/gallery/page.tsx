import React from "react";
import prisma from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import GalleryAdminClient from "./GalleryAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <AdminHeader
        title="3D Dome Gallery & Photo Manager"
        subtitle="Drag & drop image files from your computer, reorder tiles, or remove photos on /gallery"
      />
      <div style={{ padding: "32px", maxWidth: "1400px" }}>
        <GalleryAdminClient initialPhotos={photos} />
      </div>
    </div>
  );
}
