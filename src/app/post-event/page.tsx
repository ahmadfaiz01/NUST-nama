"use client";

import { useState } from "react";
import Link from "next/link";

export default function PostEventPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        category: "",
        tags: "",
        registrationUrl: "",
        allowGuests: false,
        isPrivate: false,
    });
    const [images, setImages] = useState<File[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const categories = [
        "Tech & Innovation",
        "Cultural",
        "Sports",
        "Academic",
        "Career",
        "Entertainment",
        "Social",
        "Workshop",
        "Competition",
        "Other",
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would POST to Supabase
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-4">
                <div className="bg-white border-2 border-nust-blue rounded-xl p-8 md:p-12 text-center max-w-lg shadow-[8px_8px_0px_var(--nust-blue)]">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="font-heading text-4xl text-nust-blue mb-4">EVENT SUBMITTED!</h1>
                    <p className="font-display text-nust-blue/70 mb-6">
                        Your event is pending review. You&apos;ll be notified once it&apos;s approved (usually within 24 hours).
                    </p>

                    <div className="bg-nust-orange/10 rounded-lg p-4 mb-6 border border-nust-orange">
                        <p className="font-display text-sm text-nust-blue">
                            <span className="font-bold">Status:</span> <span className="text-nust-orange">⏳ Pending Review</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/" className="btn btn-primary w-full justify-center">
                            Back to Home
                        </Link>
                        <Link href="/profile" className="btn btn-outline w-full justify-center">
                            View My Events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section
                className="py-12"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="container">
                    <h1 className="text-4xl md:text-6xl text-white mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        POST AN EVENT
                    </h1>
                    <p className="text-white/80 text-lg font-display">
                        Share your event with the NUST community
                    </p>
                </div>
            </section>

            {/* Progress Steps */}
            <div className="bg-white border-b-2 border-nust-blue sticky top-20 z-40">
                <div className="container py-4">
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <button
                                    onClick={() => s < step && setStep(s)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-lg transition-all ${s === step
                                            ? "bg-nust-blue text-white shadow-[2px_2px_0px_var(--nust-orange)]"
                                            : s < step
                                                ? "bg-nust-orange text-nust-blue"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {s < step ? "✓" : s}
                                </button>
                                {s < 3 && (
                                    <div className={`w-16 h-1 ${s < step ? "bg-nust-orange" : "bg-gray-200"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-8 mt-2">
                        <span className={`font-display text-xs uppercase ${step >= 1 ? "text-nust-blue" : "text-gray-400"}`}>
                            Basic Info
                        </span>
                        <span className={`font-display text-xs uppercase ${step >= 2 ? "text-nust-blue" : "text-gray-400"}`}>
                            Details
                        </span>
                        <span className={`font-display text-xs uppercase ${step >= 3 ? "text-nust-blue" : "text-gray-400"}`}>
                            Media
                        </span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <section className="py-12">
                <div className="container max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <h2 className="font-heading text-2xl text-nust-blue mb-6">BASIC INFORMATION</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Event Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., SEECS Tech Fest 2026"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                Venue *
                                            </label>
                                            <input
                                                type="text"
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleInputChange}
                                                placeholder="e.g., SEECS Auditorium"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                Start Time *
                                            </label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary w-full mt-8"
                                >
                                    Next: Add Details
                                </button>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <h2 className="font-heading text-2xl text-nust-blue mb-6">EVENT DETAILS</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Tell everyone what your event is about..."
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Tags (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="e.g., hackathon, coding, prizes"
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Registration Link (optional)
                                        </label>
                                        <input
                                            type="url"
                                            name="registrationUrl"
                                            value={formData.registrationUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://forms.google.com/..."
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="allowGuests"
                                                checked={formData.allowGuests}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded border-2 border-nust-blue"
                                            />
                                            <span className="font-display text-nust-blue">Allow guests (non-NUST attendees)</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isPrivate"
                                                checked={formData.isPrivate}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded border-2 border-nust-blue"
                                            />
                                            <span className="font-display text-nust-blue">Private event (invite only)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn btn-outline flex-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="btn btn-primary flex-1"
                                    >
                                        Next: Add Media
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Media */}
                        {step === 3 && (
                            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <h2 className="font-heading text-2xl text-nust-blue mb-6">ADD MEDIA</h2>

                                <div className="space-y-6">
                                    {/* Upload Area */}
                                    <div className="border-2 border-dashed border-nust-blue rounded-xl p-8 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="text-5xl mb-4">📷</div>
                                            <p className="font-heading text-xl text-nust-blue mb-2">UPLOAD IMAGES</p>
                                            <p className="font-display text-sm text-nust-blue/60">
                                                Drag and drop or click to select (max 5 images)
                                            </p>
                                        </label>
                                    </div>

                                    {/* Preview */}
                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {images.map((file, index) => (
                                                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-nust-blue">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Upload ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="btn btn-outline flex-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                    >
                                        Submit Event
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}
