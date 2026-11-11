
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Studio, } from "@/lib/studios";
import { Field } from "../ui/field";
import { authClient, getJwtToken } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast"

const API_URL = "http://localhost:5000/allStudio";

type Props = {
    studio: Studio;
    onUpdated?: () => void;
};

type FormData = {
    title: string;
    category: string;
    location: string;
    description: string;
    image: string;
    hourlyRate: string;
    deposit: string;
    capacity: string;
    size: string;
    amenities: string[];
    hostName: string;
    hostBio: string;
};

const amenitiesList = [
    "Natural Light",
    "Air Conditioning",
    "Wi-Fi",
    "Parking",
    "Soundproof",
    "Lighting Equipment",
    "Props",
    "Makeup Room",
];

const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary";

const textareaClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary";

const buttonClass =
    "rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground";

export default function EditStudioDialog({
    studio,
    onUpdated,
}: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState<FormData>({
        title: "",
        category: "",
        location: "",
        description: "",
        image: "",
        hourlyRate: "",
        deposit: "",
        capacity: "",
        size: "",
        amenities: [],
        hostName: "",
        hostBio: "",
    });

    const { data: session } = authClient.useSession();
    const user = session?.user;

    // Load selected studio data
    useEffect(() => {
        if (!open) return;

        setForm({
            title: studio.name,
            category: studio.category,
            location: studio.location,
            description: studio.description,
            image: studio.image,
            hourlyRate: String(studio.hourlyRate),
            deposit: "",
            capacity: String(studio.capacity),
            size: "",
            amenities: [...studio.amenities],
            hostName: user?.name || "",
            hostBio: "",
        });

        setError("");
    }, [open, studio]);

    const update = (key: keyof FormData, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleAmenity = (amenity: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((item) => item !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const id = studio._id ?? studio.id;

        const data = {
            studioName: form.title,
            category: form.category,
            location: form.location,
            description: form.description,
            coverImage: form.image,
            hourlyRate: Number(form.hourlyRate),
            deposit: Number(form.deposit),
            capacity: Number(form.capacity),
            size: Number(form.size),
            amenities: form.amenities,
            hostName: form.hostName,
            hostBio: form.hostBio,
        }

        console.log("Submitting data:", data);

        if (!id) {
            setError("Studio ID not found!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = await getJwtToken();

            if (!token) throw new Error("No token");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update studio");
            }

            toast.add({
                title: "Listing updated",
                description: `your listing has been updated.`,
                type: "success",
            });

            setOpen(false);
            onUpdated?.();

        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                <Button className="h-10  rounded-full px-4 text-sm font-medium">
                    <Pencil className="size-4" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="!w-[95vw] !max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Studio</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-6"
                >
                    {/* Studio information */}

                    <section className="space-y-5 rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold">The space</h2>


                        <input
                            placeholder="e.g., Downtown Photography Studio"
                            className={inputClass}
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                        />



                        <input
                            placeholder="e.g., Photography, Music, Dance"
                            className={inputClass}
                            value={form.category}
                            onChange={(e) => update("category", e.target.value)}
                        />



                        <input
                            placeholder="City, State, or Address"
                            className={inputClass}
                            value={form.location}
                            onChange={(e) => update("location", e.target.value)}
                        />



                        <textarea
                            placeholder="Describe your studio, its features, and what makes it unique."
                            rows={4}
                            maxLength={500}
                            className={textareaClass}
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                        />

                        <input
                            placeholder="https://example.com/image.jpg"
                            className={inputClass}
                            value={form.image}
                            onChange={(e) => update("image", e.target.value)}
                        />
                    </section>

                    {/* Pricing */}

                    <section className="space-y-5 rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold">
                            Pricing & capacity
                        </h2>

                        {(
                            [
                                ["hourlyRate", "Hourly rate"],
                                ["deposit", "Security deposit"],
                                ["capacity", "Capacity"],
                                ["size", "Size (sq ft)"],
                            ] as const
                        ).map(([key, label]) => (
                            <Field key={key}>
                                <input
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    type="number"
                                    min="0"
                                    className={inputClass}
                                    value={form[key]}
                                    onChange={(e) => update(key, e.target.value)}
                                />
                            </Field>
                        ))}

                        <div className="flex flex-wrap gap-2">
                            {amenitiesList.map((amenity) => {
                                const selected = form.amenities.includes(amenity);

                                return (
                                    <button
                                        key={amenity}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity)}
                                        className={`rounded-full border px-4 py-2 text-sm ${selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border"
                                            }`}
                                    >
                                        {amenity}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Host information */}

                    <section className="space-y-5 rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold">
                            Host information
                        </h2>

                        <input
                            disabled
                            className={inputClass}
                            value={user?.name || form.hostName}
                            onChange={(e) => update("hostName", e.target.value)}
                        />

                        <textarea
                            placeholder="Tell us about yourself and what makes you a great host"
                            className={textareaClass}
                            value={form.hostBio}
                            onChange={(e) => update("hostBio", e.target.value)}
                        />
                    </section>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button

                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Studio"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
