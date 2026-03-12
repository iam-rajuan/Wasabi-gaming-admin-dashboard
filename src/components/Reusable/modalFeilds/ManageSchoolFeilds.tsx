"use client";
import { Globe, Mail, Phone, Building, Users, Calendar, Briefcase, Tag, FileText, Camera, DollarSign, MapPin, Award, HeartHandshake, Cpu, Globe as DiversityIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import UpdatedManageSchoolFeilds from "./UpdatedManageSchoolFeilds";
import TextEditor from "../editor/EditSection";

interface ManageSchoolFeildsProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    edit?: boolean;
    view?: boolean;
    job?: any;
    onClose?: () => void;
}

const ManageLawFirmFields: React.FC<ManageSchoolFeildsProps> = ({ formData, onChange, edit = false, view }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);

    useEffect(() => {
        if (formData.logo && formData.logo instanceof File) {
            const objectUrl = URL.createObjectURL(formData.logo);
            setLogoPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else if (formData.logo && typeof formData.logo === 'string') {
            setLogoPreview(formData.logo);
        } else {
            setLogoPreview(null);
        }
    }, [formData.logo]);

    useEffect(() => {
        if (formData.coverImage && formData.coverImage instanceof File) {
            const objectUrl = URL.createObjectURL(formData.coverImage);
            setCoverImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else if (formData.coverImage && typeof formData.coverImage === 'string') {
            setCoverImagePreview(formData.coverImage);
        } else {
            setCoverImagePreview(null);
        }
    }, [formData.coverImage]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange("logo", file);
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange("coverImage", file);
        }
    };

    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(logoPreview);
            }
            if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(coverImagePreview);
            }
        };
    }, []);


    const practiceAreas = [
        "Mergers & Acquisitions",
        "Capital Markets",
        "Private Equity",
        "Litigation & Arbitration",
        "White Collar Defense",
        "Antitrust",
        "Intellectual Property",
        "Tax Law",
        "Environmental Law",
        "Financial Regulation",
        "Restructuring",
        "Real Estate",
        "Cybersecurity",
        "Blockchain & Digital Assets",
        "Healthcare & Life Sciences",
        "Energy & Infrastructure",
        "Corporate Governance",
        "Securities Law",
        "Employment Law",
        "International Trade"
    ];

    const handleTagToggle = (tag) => {
        const currentTags = formData.practiceAreas || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        onChange("practiceAreas", newTags);
    };

    const renderBasicInfo = () => (
        <>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="h-full w-full object-cover"
                            />
                        ) : formData.logo && typeof formData.logo === 'string' ? (
                            <img
                                src={formData.logo}
                                alt="Logo"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Building className="text-blue-600 h-10 w-10" />
                        )}
                    </div>

                    {!view && (
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleLogoChange}
                            id="logo-upload"
                        />
                    )}
                </div>

                <div>
                    <label
                        htmlFor="logo-upload"
                        className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                    >
                        {logoPreview || formData.logo ? "Change logo" : "Add logo"}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                        Recommended: 200×200px PNG/JPG
                    </p>
                </div>
            </div>


            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                </label>
                <div className="relative">
                    <div className="h-48 w-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300 border-dashed">
                        {coverImagePreview ? (
                            <img
                                src={coverImagePreview}
                                alt="Cover image preview"
                                className="h-full w-full object-cover"
                            />
                        ) : formData.coverImage && typeof formData.coverImage === 'string' ? (
                            <img
                                src={formData.coverImage}
                                alt="Cover image"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="text-center">
                                <Camera className="text-gray-400 h-12 w-12 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">Upload cover image</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Recommended: 1200×400px PNG/JPG
                                </p>
                            </div>
                        )}
                    </div>

                    {!view && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleCoverImageChange}
                                id="cover-image-upload"
                            />
                            <div className="absolute bottom-4 right-4">
                                <label
                                    htmlFor="cover-image-upload"
                                    className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                                >
                                    {coverImagePreview || formData.coverImage ? "Change cover image" : "Upload cover image"}
                                </label>
                            </div>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    This image appears at the top of your law firm profile page
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firm Name *
                    </label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.name || ""}
                            onChange={(e) => onChange("name", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter law firm name"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline/Excellence Statement *
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.tagline || ""}
                            onChange={(e) => onChange("tagline", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Global Legal Excellence Since 1879"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headquarters Location *
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.headquarters || ""}
                            onChange={(e) => onChange("headquarters", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., New York, NY"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Attorneys *
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="number"
                            value={formData.attorneys || ""}
                            onChange={(e) => onChange("attorneys", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 850"
                            min="0"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Founding Year *
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="number"
                            value={formData.foundingYear || ""}
                            onChange={(e) => onChange("foundingYear", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 1879"
                            min="1800"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Partners
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="number"
                            value={formData.partners || ""}
                            onChange={(e) => onChange("partners", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 200"
                            min="0"
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website *
                    </label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="url"
                            value={formData.website || ""}
                            onChange={(e) => onChange("website", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://www.firmname.com"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => onChange("email", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="info@firmname.com"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="tel"
                            value={formData.phone || ""}
                            onChange={(e) => onChange("phone", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (212) 558-4000"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Revenue
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.revenue || ""}
                            onChange={(e) => onChange("revenue", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., $2.1 Billion"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Office Locations (comma separated)
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={formData.officeLocations || ""}
                            onChange={(e) => onChange("officeLocations", e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="New York, London, Hong Kong, etc."
                        />
                    </div>
                </div>
            </div>
        </>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Firm Overview *
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.overview || ""}
                                    onChange={(value) => onChange("overview", value)}
                                    placeholder="Describe the firm's history, mission, and key differentiators..."
                                />
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Establishment Details
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.establishment || ""}
                                    onChange={(value) => onChange("establishment", value)}
                                    placeholder="Details about the firm's founding, founders, and early history..."
                                />
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Key Highlights
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.highlights || ""}
                                    onChange={(value) => onChange("highlights", value)}
                                    placeholder="List key achievements, rankings, and notable facts..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case "practices":
                return (
                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Practice Areas *
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {practiceAreas.map((area) => (
                                    <button
                                        key={area}
                                        type="button"
                                        onClick={() => handleTagToggle(area)}
                                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${(formData.practiceAreas || []).includes(area)
                                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                                            : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        <Tag className="h-3 w-3" />
                                        {area}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                Selected: {(formData.practiceAreas || []).join(", ") || "None"}
                            </p>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Practice Areas Description
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.practiceAreasDesc || ""}
                                    onChange={(value) => onChange("practiceAreasDesc", value)}
                                    placeholder="Detailed description of the firm's practice areas and specializations..."
                                />
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recent Work / Notable Cases
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.recentWork || ""}
                                    onChange={(value) => onChange("recentWork", value)}
                                    placeholder="Highlight recent major deals, cases, or transactions..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case "initiatives":
                return (
                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Technology Initiatives
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.technologyInitiatives || ""}
                                    onChange={(value) => onChange("technologyInitiatives", value)}
                                    placeholder="Describe the firm's technology innovations, tools, and digital transformation..."
                                />
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Awards and Recognition
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.awards || ""}
                                    onChange={(value) => onChange("awards", value)}
                                    placeholder="List awards, rankings, and recognition received..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case "csr":
                return (
                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diversity, Equity & Inclusion
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.dei || ""}
                                    onChange={(value) => onChange("dei", value)}
                                    placeholder="Describe the firm's DE&I initiatives, statistics, and programs..."
                                />
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CSR and Pro Bono
                            </label>
                            <div className="border rounded-lg">
                                <TextEditor
                                    value={formData.csr || ""}
                                    onChange={(value) => onChange("csr", value)}
                                    placeholder="Describe corporate social responsibility initiatives and pro bono work..."
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderForm = () => (
        <div className="space-y-6 h-[79vh] overflow-y-auto">
            {renderBasicInfo()}


            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Section URLs (for Yellow Separators)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Key Highlights URL
                        </label>
                        <input
                            type="url"
                            value={formData.highlightsUrl || ""}
                            onChange={(e) => onChange("highlightsUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/about/highlights"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Practice Areas URL
                        </label>
                        <input
                            type="url"
                            value={formData.practiceAreasUrl || ""}
                            onChange={(e) => onChange("practiceAreasUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/practices"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recent Work URL
                        </label>
                        <input
                            type="url"
                            value={formData.recentWorkUrl || ""}
                            onChange={(e) => onChange("recentWorkUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/our-work"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Technology Initiatives URL
                        </label>
                        <input
                            type="url"
                            value={formData.technologyUrl || ""}
                            onChange={(e) => onChange("technologyUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/innovation"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Awards URL
                        </label>
                        <input
                            type="url"
                            value={formData.awardsUrl || ""}
                            onChange={(e) => onChange("awardsUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/about/awards"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            DE&I URL
                        </label>
                        <input
                            type="url"
                            value={formData.deiUrl || ""}
                            onChange={(e) => onChange("deiUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/diversity"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CSR URL
                        </label>
                        <input
                            type="url"
                            value={formData.csrUrl || ""}
                            onChange={(e) => onChange("csrUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/probono"
                        />
                    </div>
                </div>
            </div>


            <div>
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 overflow-x-auto">
                        {[
                            { key: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
                            { key: "practices", label: "Practices & Work", icon: <Briefcase className="h-4 w-4" /> },
                            { key: "initiatives", label: "Initiatives", icon: <Cpu className="h-4 w-4" /> },
                            { key: "csr", label: "CSR & DE&I", icon: <HeartHandshake className="h-4 w-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.key
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );

    const editForm = () => (
        <div className="space-y-6 h-[79vh] overflow-y-auto">

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <strong>Edit Mode:</strong> You are editing the law firm profile. Changes will be saved when you submit the form.
                        </p>
                    </div>
                </div>
            </div>

            {renderBasicInfo()}


            <div>
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 overflow-x-auto">
                        {[
                            { key: "overview", label: "Overview", icon: <FileText className="h-4 w-4" /> },
                            { key: "practices", label: "Practices & Work", icon: <Briefcase className="h-4 w-4" /> },
                            { key: "initiatives", label: "Initiatives", icon: <Cpu className="h-4 w-4" /> },
                            { key: "csr", label: "CSR & DE&I", icon: <HeartHandshake className="h-4 w-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.key
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>


            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Section URLs Configuration</h3>
                <p className="text-sm text-gray-600">Configure URLs for the yellow separator boxes between sections:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Key Highlights URL
                        </label>
                        <input
                            type="url"
                            value={formData.highlightsUrl || ""}
                            onChange={(e) => onChange("highlightsUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/about/highlights"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Practice Areas URL
                        </label>
                        <input
                            type="url"
                            value={formData.practiceAreasUrl || ""}
                            onChange={(e) => onChange("practiceAreasUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/practices"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recent Work URL
                        </label>
                        <input
                            type="url"
                            value={formData.recentWorkUrl || ""}
                            onChange={(e) => onChange("recentWorkUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/our-work"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Technology Initiatives URL
                        </label>
                        <input
                            type="url"
                            value={formData.technologyUrl || ""}
                            onChange={(e) => onChange("technologyUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/innovation"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Awards URL
                        </label>
                        <input
                            type="url"
                            value={formData.awardsUrl || ""}
                            onChange={(e) => onChange("awardsUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/about/awards"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            DE&I URL
                        </label>
                        <input
                            type="url"
                            value={formData.deiUrl || ""}
                            onChange={(e) => onChange("deiUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/diversity"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CSR URL
                        </label>
                        <input
                            type="url"
                            value={formData.csrUrl || ""}
                            onChange={(e) => onChange("csrUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://firm.com/probono"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>

            {view ? (
                <UpdatedManageSchoolFeilds />
            ) : (

                <div className="space-y-6">


                    {edit ? editForm() : renderForm()}
                </div>
            )}
        </div>
    );
};

export default ManageLawFirmFields;