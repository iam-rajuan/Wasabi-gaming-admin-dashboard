'use client'

import { useState, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'

interface CreateCareerModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: FormData) => Promise<void>
    category: 'student' | 'school'
    submitting: boolean
}

export function CreateCareerModal({
    isOpen,
    onClose,
    onSubmit,
    category,
    submitting,
}: CreateCareerModalProps) {
    const [title, setTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', title)
        formData.append('category', category)
        if (selectedFile) {
            formData.append('image', selectedFile)
        }

        try {
            await onSubmit(formData)
            // Reset form on success (handled by parent usually, but good to clear local state)
            setTitle('')
            setSelectedFile(null)
            setPreview('')
        } catch (error) {
            // Error handling in parent
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Add Item to {category === 'student' ? 'Student' : 'School'} Section
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Card Image
                        </Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-full h-48 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group overflow-hidden"
                        >
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <>
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Click to upload image
                                    </span>
                                    <span className="text-xs text-muted-foreground/70 mt-1">
                                        PNG, JPG, GIF up to 5MB
                                    </span>
                                </>
                            )}

                            {preview && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" /> Change Image
                                    </span>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                                required
                            />
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            Title
                        </Label>
                        <Input
                            id="title"
                            className="rounded-xl h-12 text-lg font-medium shadow-none focus-visible:ring-1"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. CV Builder"
                            required
                        />
                    </div>

                    {/* Category (Read-only) */}
                    <div className="space-y-2 opacity-60">
                        <Label
                            htmlFor="category"
                            className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            Category
                        </Label>
                        <Input
                            id="category"
                            className="rounded-xl h-12 font-medium bg-muted"
                            value={category}
                            readOnly
                        />
                    </div>

                    <DialogFooter className="pt-6 border-t mt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="rounded-full px-6 font-bold"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-10 font-bold h-12 shadow-none"
                        >
                            {submitting && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Create Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
