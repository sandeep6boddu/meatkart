"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    BarChart3,
    Database,
    Layers,
    Lock,
    Rocket,
    ShoppingBag,
    ShieldCheck,
    Zap,
    Target,
    ArrowRight
} from "lucide-react";

export default function ExecutiveSummaryPage() {
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-20 selection:bg-red-100 selection:text-red-900">
            {/* Hero Section */}
            <header className="relative bg-white border-b border-neutral-200 pt-24 pb-16 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-neutral-100 rounded-full blur-3xl opacity-50" />

                <div className="container mx-auto px-6 relative z-10">
                    <Badge className="mb-4 bg-red-600 hover:bg-red-700 transition-colors uppercase tracking-widest px-3 py-1">
                        Executive Report 2026
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-950 mb-6 max-w-4xl leading-[1.1]">
                        MeatKart: Scaling Premium <span className="text-red-600">Meat E-Commerce</span> in Hyderabad
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
                        A strategic overview of the MeatKart digital ecosystem—combining technical excellence with a localized business focus to redefine the meat sourcing experience.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-6 mt-16 space-y-24">

                {/* Project Vision */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-2xl mb-6">
                            <Target className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Project Overview & Vision</h2>
                        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                            MeatKart bridges the gap between traditional meat sourcing and modern digital convenience.
                            The platform is designed to offer customers a seamless way to purchase quality-assured
                            mutton, chicken, and seafood with the trust of Halal certification and premium packaging.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "Quality Assurance", desc: "Direct-to-consumer freshness." },
                                { title: "Customization", desc: "Unique weight-based variants." },
                                { title: "Convenience", desc: "Scheduled delivery slots." },
                                { title: "Trust", desc: "Verified Halal certification." }
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 bg-white border border-neutral-100 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-neutral-900">{item.title}</h3>
                                    <p className="text-sm text-neutral-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-neutral-200 rounded-3xl overflow-hidden shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-neutral-900/20 group-hover:opacity-0 transition-opacity" />
                            <img
                                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1000&auto=format&fit=crop"
                                alt="Premium Meat"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 hidden lg:block">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 rounded-full">
                                    <ShieldCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Production Ready</p>
                                    <p className="text-lg font-bold">100% Quality Checked</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Capabilities */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Core Ecosystem Capabilities</h2>
                        <p className="text-neutral-500 max-w-2xl mx-auto">A bidirectional platform designed for both consumer ease and administrative control.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-neutral-100 shadow-sm overflow-hidden group hover:border-red-200 transition-colors">
                            <CardHeader className="bg-neutral-50/50 p-8 border-b border-neutral-100">
                                <div className="flex items-center gap-3 text-red-600 mb-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Frontend Solution</span>
                                </div>
                                <CardTitle className="text-2xl">Customer Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {[
                                    "Advanced Product Catalog with smart filters",
                                    "Dynamic selection with real-time price updates",
                                    "Cross-session persistent shopping cart",
                                    "Secure account dashboard & wallet system"
                                ].map((text, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                        </div>
                                        <p className="text-neutral-600">{text}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-100 shadow-sm overflow-hidden group hover:border-neutral-300 transition-colors">
                            <CardHeader className="bg-neutral-50/50 p-8 border-b border-neutral-100">
                                <div className="flex items-center gap-3 text-neutral-900 mb-2">
                                    <BarChart3 className="w-5 h-5" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Control Panel</span>
                                </div>
                                <CardTitle className="text-2xl">Admin Governance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {[
                                    "Real-time revenue and growth analytics",
                                    "Effortless inventory & pricing management",
                                    "Streamlined order lifecycle workflows",
                                    "Automated refund & wallet balance handling"
                                ].map((text, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                        </div>
                                        <p className="text-neutral-600">{text}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Tech Stack Deep Dive */}
                <section className="bg-neutral-950 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-16 text-center">Modern Tech Stack Selection</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: <Rocket className="w-8 h-8 text-red-500" />,
                                    name: "Next.js 15",
                                    what: "Frontend/Backend Framework",
                                    why: "SEO efficiency and high-speed SSR.",
                                    where: "Total Frontend Infrastructure."
                                },
                                {
                                    icon: <Database className="w-8 h-8 text-blue-500" />,
                                    name: "PostgreSQL & Prisma",
                                    what: "Persistence Layer",
                                    why: "Type-safe database interactions.",
                                    where: "Action logic & Data models."
                                },
                                {
                                    icon: <Lock className="w-8 h-8 text-green-500" />,
                                    name: "Supabase Auth",
                                    what: "Identity Management",
                                    why: "Production-ready security.",
                                    where: "Authentication middleware."
                                },
                                {
                                    icon: <Layers className="w-8 h-8 text-orange-500" />,
                                    name: "Tailwind CSS",
                                    what: "Design System",
                                    why: "Rapid, consistent UI development.",
                                    where: "All visual components."
                                },
                                {
                                    icon: <Zap className="w-8 h-8 text-yellow-500" />,
                                    name: "Zustand",
                                    what: "State Management",
                                    why: "Zero-boilerplate sync.",
                                    where: "Cart & Location stores."
                                },
                                {
                                    icon: <ArrowRight className="w-8 h-8 text-red-500" />,
                                    name: "Radix UI",
                                    what: "Accessibility Layer",
                                    why: "WAI-ARIA compliant primitives.",
                                    where: "Complex interactive components."
                                }
                            ].map((tech, i) => (
                                <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="mb-6">{tech.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                                    <div className="space-y-3 mt-4 text-sm">
                                        <p className="text-neutral-400"><span className="text-white font-medium">What:</span> {tech.what}</p>
                                        <p className="text-neutral-400"><span className="text-white font-medium">Why:</span> {tech.why}</p>
                                        <p className="text-neutral-400"><span className="text-white font-medium">Where:</span> {tech.where}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roadmap */}
                <section className="bg-white border border-neutral-100 rounded-3xl p-12 shadow-sm">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold mb-8">Strategic Growth Roadmap</h2>
                        <div className="space-y-8">
                            {[
                                { title: "Integrated Payments", desc: "Expanding beyond COD to include Razorpay and Stripe for global digital flexibility." },
                                { title: "Real-time Logistics", desc: "WebSocket-based live order tracking for complete user transparency." },
                                { title: "Retention Engine", desc: "Loyalty points, referral systems, and dynamic discounting mechanisms." },
                                { title: "Engagement Content", desc: "Integrated recipe guides to position MeatKart as a lifestyle culinary partner." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="text-2xl font-black text-red-100 tabular-nums">0{i + 1}</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-neutral-600 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <footer className="container mx-auto px-6 mt-20 text-center text-neutral-400 text-sm">
                <Separator className="mb-8" />
                <p>© 2026 MeatKart Digital. Confidential Executive Document.</p>
            </footer>
        </div>
    );
}
