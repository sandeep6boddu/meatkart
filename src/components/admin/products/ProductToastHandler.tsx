'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

function ToastLogic() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const success = searchParams.get('success');
        if (success) {
            if (success === 'created') {
                toast.success('Product created successfully');
            } else if (success === 'updated') {
                toast.success('Product updated successfully');
            }
            // Clean up the URL
            router.replace(pathname);
        }
    }, [searchParams, router, pathname]);

    return null;
}

export function ProductToastHandler() {
    return (
        <Suspense fallback={null}>
            <ToastLogic />
        </Suspense>
    );
}
