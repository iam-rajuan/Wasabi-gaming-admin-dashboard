"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Loader2, Image as ImageIcon, X } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { websiteApi } from "../../services/website.api";
import { toast } from "sonner";
import Image from "next/image";
import { DeleteModal } from "../../components/DeleteModal";

export function HeroCTAManagement() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [viewingItem, setViewingItem] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        type: "hero-students",
        primaryButton: "",
        secondaryButton: "",
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await websiteApi.getHeroSections();
            if (res.success) {
                setItems(res.data);
            }
        } catch (error) {
            toast.error("Failed to fetch items");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...files]);

            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            subtitle: "",
            description: "",
            type: "hero-students",
            primaryButton: "",
            secondaryButton: "",
        });
        setSelectedFiles([]);
        setPreviews([]);
        setEditingItem(null);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            title: item.title || "",
            subtitle: item.subtitle || "",
            description: item.description || "",
            type: item.type || "hero-students",
            primaryButton: item.primaryButton || "",
            secondaryButton: item.secondaryButton || "",
        });
        setPreviews(item.thumbnail || []);
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
            const res = await websiteApi.deleteHeroSection(deletingId);
            if (res.success) {
                toast.success("Item deleted successfully");
                fetchItems();
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            toast.error("Failed to delete item");
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
            // Flattened structure as requested
            Object.entries(formData).forEach(([key, value]) => {
                fd.append(key, value);
            });

            selectedFiles.forEach((file) => {
                fd.append("thumbnail", file);
            });

            let res;
            if (editingItem) {
                res = await websiteApi.updateHeroSection(editingItem._id, fd);
            } else {
                res = await websiteApi.createHeroSection(fd);
            }

            if (res.success) {
                toast.success(editingItem ? "Updated successfully" : "Created successfully");
                setIsModalOpen(false);
                resetForm();
                fetchItems();
            } else {
                toast.error((res as any).message || "Something went wrong");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Hero & CTA Sections</h2>
                    <p className="text-sm text-muted-foreground">Manage landing page and CTA content.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-6 font-medium"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[150px] text-[18px] font-bold text-foreground">Type</TableHead>
                            <TableHead className="text-[18px] font-bold text-foreground">Title</TableHead>
                            <TableHead className="text-[18px] font-bold text-foreground">Subtitle</TableHead>
                            <TableHead className="text-[18px] font-bold text-foreground">Description</TableHead>
                            <TableHead className="text-right text-[18px] font-bold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                                    No items found. Start by adding one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-base">
                                        <span className="bg-primary/10 text-primary text-[12px] uppercase font-bold px-2 py-1 rounded">
                                            {item.type?.replace("-", " ")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-bold text-base max-w-[150px] truncate">{item.title}</TableCell>
                                    <TableCell className="text-muted-foreground text-base font-semibold max-w-[150px] truncate">{item.subtitle}</TableCell>
                                    <TableCell className="text-muted-foreground text-base max-w-[200px] truncate">{item.description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => { setViewingItem(item); setIsViewModalOpen(true); }}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => confirmDelete(item._id)}>
                                                <Trash2 className="w-4 h-4" />
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{editingItem ? "Edit Section" : "Add New Section"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Section Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger className="rounded-lg">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hero-students">Hero Students</SelectItem>
                                        <SelectItem value="hero-school">Hero School</SelectItem>
                                        <SelectItem value="students-cta">Students CTA</SelectItem>
                                        <SelectItem value="school-cta">School CTA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    className="rounded-lg"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter title"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                className="rounded-lg"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="Enter subtitle"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                className="rounded-lg"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primaryButton">Primary Button Text</Label>
                                <Input
                                    id="primaryButton"
                                    className="rounded-lg"
                                    value={formData.primaryButton}
                                    onChange={(e) => setFormData({ ...formData, primaryButton: e.target.value })}
                                    placeholder="e.g. Get Started"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="secondaryButton">Secondary Button Text</Label>
                                <Input
                                    id="secondaryButton"
                                    className="rounded-lg"
                                    value={formData.secondaryButton}
                                    onChange={(e) => setFormData({ ...formData, secondaryButton: e.target.value })}
                                    placeholder="e.g. Learn More"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Thumbnails / Images</Label>
                            <div className="flex flex-wrap gap-3 mb-2">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative w-24 h-24 border rounded-xl overflow-hidden group shadow-sm">
                                        <Image src={preview} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-1 right-1 bg-destructive/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-24 h-24 border border-dashed border-muted-foreground/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all group">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] text-muted-foreground mt-1 group-hover:text-primary">Add Image</span>
                                    <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t">
                            <Button type="button" variant="outline" className="rounded-full px-6" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-8 font-medium shadow-none"
                            >
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingItem ? "Update Changes" : "Create Section"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">View Section Details</DialogTitle>
                    </DialogHeader>
                    {viewingItem && (
                        <div className="space-y-6 py-4">
                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {viewingItem.type?.replace("-", " ")}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-extrabold leading-tight tracking-tight">{viewingItem.title}</h3>
                                <p className="text-2xl text-muted-foreground font-bold">{viewingItem.subtitle}</p>
                            </div>
                            <p className="text-xl text-muted-foreground leading-relaxed">{viewingItem.description}</p>
                            <div className="flex gap-3">
                                {viewingItem.primaryButton && (
                                    <Button className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-6 font-medium shadow-none">
                                        {viewingItem.primaryButton}
                                    </Button>
                                )}
                                {viewingItem.secondaryButton && (
                                    <Button variant="outline" className="rounded-full px-6 font-medium border-muted-foreground/20">
                                        {viewingItem.secondaryButton}
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Images</Label>
                                <div className="flex flex-wrap gap-3">
                                    {viewingItem.thumbnail?.map((src: string, i: number) => (
                                        <div key={i} className="relative w-40 h-24 border rounded-xl overflow-hidden shadow-sm">
                                            <Image src={src} alt="thumbnail" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                loading={submitting}
            />
        </div>
    );
}
