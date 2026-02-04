import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteCategoryButton } from "@/components/admin/categories/DeleteCategoryButton";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Categories</h1>
        <Link href="/admin/categories/new">
          <Button className="tw-flex tw-items-center tw-gap-2">
            <Plus size={16} />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Order</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Image</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Name</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Slug</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Products</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500 tw-text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {category.displayOrder}
                    </td>
                    <td className="tw-px-6 tw-py-4">
                      {category.imageUrl ? (
                        <img 
                          src={category.imageUrl} 
                          alt={category.name} 
                          className="tw-h-10 tw-w-10 tw-rounded-lg tw-object-cover tw-bg-gray-100"
                        />
                      ) : (
                        <div className="tw-h-10 tw-w-10 tw-rounded-lg tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-text-xs tw-text-gray-400">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      {category.name}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600 tw-font-mono tw-text-xs">
                      {category.slug}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      <span className="tw-px-2.5 tw-py-0.5 tw-rounded-full tw-bg-blue-50 tw-text-blue-700 tw-text-xs tw-font-medium">
                        {category._count.products} products
                      </span>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-right">
                      <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Button variant="ghost" size="icon" className="tw-h-8 tw-w-8 tw-text-blue-600">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                        <DeleteCategoryButton id={category.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
