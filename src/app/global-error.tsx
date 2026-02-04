'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="tw-flex tw-min-h-screen tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-p-4">
                    <h2 className="tw-text-2xl tw-font-bold">Something went wrong!</h2>
                    <p className="tw-text-gray-600">{error.message || 'An unexpected error occurred'}</p>
                    <button
                        className="tw-rounded-md tw-bg-primary tw-px-4 tw-py-2 tw-text-white hover:tw-bg-primary/90"
                        onClick={() => reset()}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
