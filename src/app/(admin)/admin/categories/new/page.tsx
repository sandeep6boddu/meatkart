import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export const dynamic = 'force-dynamic';

export default function NewCategoryPage() {
  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Add New Category</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
