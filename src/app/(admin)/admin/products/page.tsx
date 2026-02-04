import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";

import { ProductToastHandler } from "@/components/admin/products/ProductToastHandler";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      productWeights: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="tw-space-y-6">
      <ProductToastHandler />
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Products</h1>
        <Link href="/admin/products/new">
          <Button className="tw-flex tw-items-center tw-gap-2">
            <Plus size={16} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Name</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Category</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Slug</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Stock</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Status</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500 tw-text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                    No products found. Create one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      {product.name}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600 tw-font-mono tw-text-xs">
                      {product.slug}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {product.stockQuantity}
                    </td>
                    <td className="tw-px-6 tw-py-4">
                      <span
                        className={`tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium ${product.isActive
                            ? "tw-bg-green-100 tw-text-green-800"
                            : "tw-bg-red-100 tw-text-red-800"
                          }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-right">
                      <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" className="tw-h-8 tw-w-8 tw-text-blue-600">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                        <DeleteProductButton id={product.id} />
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
