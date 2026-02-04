'use client'

import { deleteProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        const result = await deleteProduct(id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="tw-h-8 tw-w-8 tw-text-red-600 hover:tw-text-red-800 hover:tw-bg-red-50"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 size={16} />
    </Button>
  );
}
