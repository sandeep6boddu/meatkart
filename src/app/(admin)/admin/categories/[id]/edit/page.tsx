import prisma from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Edit Category</h1>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
