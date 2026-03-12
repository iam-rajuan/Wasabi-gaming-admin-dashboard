"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { websiteApi } from "../../services/website.api";
import { toast } from "sonner";
import Image from "next/image";
import { DeleteModal } from "../../components/DeleteModal";

export function AchievementManagement() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await websiteApi.getCards();
            if (res.success) {
                setItems(res.data || []);
            }
        } catch (error) {
            toast.error("Failed to fetch achievements");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            subtitle: "",
            description: "",
        });
        setSelectedFile(null);
        setPreview("");
        setEditingItem(null);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "",
            subtitle: item.subtitle || "",
            description: item.description || "",
        });
        setPreview(item.image || "");
        setIsModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            setSubmitting(true);
            const res = await websiteApi.deleteCard(deletingId);
            if (res.success) {
                toast.success("Achievement deleted");
                fetchItems();
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            toast.error("Failed to delete achievement");
        } finally {
            setSubmitting(false);
            setDeletingId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const fd = new FormData();
            fd.append("data", JSON.stringify(formData));
            if (selectedFile) {
                fd.append("image", selectedFile);
            }

            let res;
            if (editingItem) {
                res = await websiteApi.updateCard(editingItem._id, fd);
            } else {
                res = await websiteApi.createCard(fd);
            }

            if (res.success) {
                toast.success(editingItem ? "Updated successfully" : "Achievement added");
                setIsModalOpen(false);
                resetForm();
                fetchItems();
            } else {
                toast.error((res as any).message || "Failed to save");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recent Achievements</h2>
                    <p className="text-sm text-muted-foreground">Manage achievement cards for the website landing page.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-6 font-bold"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Achievement
                </Button>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[120px] text-[18px] font-bold text-foreground">Preview</TableHead>
                            <TableHead className="text-[18px] font-bold text-foreground">Achievement</TableHead>
                            <TableHead className="text-[18px] font-bold text-foreground">Category</TableHead>
                            <TableHead className="text-right text-[18px] font-bold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-20 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic text-lg">
                                    No achievements listed. Click 'Add Achievement' to begin.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="relative w-24 h-16 border rounded-lg overflow-hidden shadow-sm bg-muted">
                                            {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-base font-bold text-foreground">{item.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-base font-semibold text-muted-foreground">{item.subtitle}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => handleEdit(item)}>
                                                <Edit className="w-5 h-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-destructive/5 hover:text-destructive transition-colors" onClick={() => confirmDelete(item._id)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{editingItem ? "Edit Achievement" : "New Achievement"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Achievement Image</Label>
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-2xl bg-muted/30 group transition-colors hover:border-primary/30">
                                {preview ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                                        <Image src={preview} alt="Preview" fill className="object-cover" />
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Edit className="w-6 h-6 text-white" />
                                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="w-full flex flex-col items-center justify-center cursor-pointer py-10">
                                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                            <ImageIcon className="w-8 h-8 text-primary" />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">Click to upload image</span>
                                        <span className="text-xs text-muted-foreground mt-1">Recommended size 800x600</span>
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                                <Input
                                    id="title"
                                    className="rounded-xl h-12 text-lg font-medium shadow-none outline-none border-muted-foreground/20"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Chemistry Basics"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category/Subtitle</Label>
                                <Input
                                    id="subtitle"
                                    className="rounded-xl h-12 text-lg font-medium shadow-none outline-none border-muted-foreground/20"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="e.g. Foundation Course"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                <Textarea
                                    id="description"
                                    className="rounded-xl h-24 text-base font-medium resize-none shadow-none outline-none border-muted-foreground/20"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief summary..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t">
                            <Button type="button" variant="ghost" className="rounded-full px-6 font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-10 font-bold h-12 shadow-none"
                            >
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingItem ? "Update Changes" : "Save Achievement"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                loading={submitting}
                title="Remove Achievement?"
                description="This will permanently delete this achievement card. Are you sure?"
            />
        </div>
    );
}
