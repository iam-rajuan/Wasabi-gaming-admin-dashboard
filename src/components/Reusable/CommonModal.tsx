"use client";
import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";

const CommonModal = ({
    isOpen,
    onClose,
    onSave,
    title,
    fields = [],
    initialData = {},
    submitText = "Save",
}) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            const initialFormData = {};
            fields.forEach((field) => {
                initialFormData[field.name] = initialData[field.name] || "";
            });
            setFormData(initialFormData);
        }
    }, [isOpen, initialData, fields]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, name) => {
        const file = e.target.files?.[0];
        if (file) handleChange(name, file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>

                            {field.type === "text" && (
                                <Input
                                    id={field.name}
                                    type="text"
                                    value={formData[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            )}

                            {field.type === "textarea" && (
                                <Textarea
                                    id={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    rows={field.rows || 3}
                                    className="resize-none"
                                />
                            )}

                            {field.type === "select" && (
                                <Select
                                    value={formData[field.name] || ""}
                                    onValueChange={(value) => handleChange(field.name, value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={field.placeholder || "Select an option"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {field.type === "file" && (
                                <div className="w-full">
                                    <Input
                                        id={field.name}
                                        type="file"
                                        onChange={(e) => handleFileChange(e, field.name)}
                                        accept={field.accept}
                                        className="cursor-pointer"
                                    />
                                    {formData[field.name] && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Selected: {formData[field.name].name}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-[20px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#FFFF00] text-black hover:bg-[#FFFF00]/90 rounded-[20px]"
                        >
                            {submitText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CommonModal;