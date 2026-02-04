
import Image from "next/image";
import Link from "next/link";

export default function ComingSoon() {
    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 text-white">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-indigo-950/80 to-slate-950/90 mix-blend-multiply z-10" />
                <Image
                    src="/images/mutton-bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-30 grayscale contrast-125"
                    priority
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/0 via-black/40 to-black/80 z-20" />
            </div>

            {/* Content Container */}
            <div className="relative z-30 container mx-auto px-4 text-center">
                {/* Glass Card */}
                <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl ring-1 ring-white/20">

                    {/* Logo Animation */}
                    <div className="mb-8 relative w-48 h-24 mx-auto animate-fade-in-down">
                        <Image
                            src="/images/logo.png"
                            alt="MeatKart Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-300 to-amber-200 tracking-tight">
                        We're Cooking Up<br />Something Special
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed font-light">
                        MeatKart is currently under maintenance to bring you a fresher,
                        smoother, and more premium shopping experience.
                    </p>

                    {/* Progress Bar (Decorative) */}
                    <div className="w-full max-w-sm mx-auto h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 w-2/3 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button disabled className="px-8 py-3 rounded-full bg-white/10 text-white/50 cursor-not-allowed font-medium text-sm tracking-wider uppercase border border-white/5">
                            Launch Date: Very Soon
                        </button>
                        <Link
                            href="mailto:contact@meatkart.com"
                            className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            Contact Us
                            <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="mt-12 text-sm text-zinc-500 font-medium tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} MeatKart. All Rights Reserved.
                </div>
            </div>
        </main>
    );
}
