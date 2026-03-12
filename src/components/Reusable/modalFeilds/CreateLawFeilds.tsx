/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Upload,
  Plus,
  X,
  Mail,
  Phone,
  Globe,
  Building,
} from "lucide-react";
import { FaBuilding } from "react-icons/fa6";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CreateLawFeildsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  edit?: boolean;
  view?: boolean;
  job?: any;          // ← real firm data comes here in view / edit mode
  onClose?: () => void;
}

const CreateLawFields: React.FC<CreateLawFeildsProps> = ({
  formData = {},
  onChange,
  edit = false,
  view = false,
  job,                // ← this is the actual firm object in view/edit
}) => {
  const disabled = view;

  // Use job (real data) in view / edit mode, otherwise use formData (create mode)
  const currentData = view || edit ? job || {} : formData;

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  // Internship Opportunities
  const [internshipOpportunities, setInternshipOpportunities] = useState<string[]>([]);
  const [currentOpportunity, setCurrentOpportunity] = useState("");

  // Culture And Value
  const [cultureAndValue, setCultureAndValue] = useState<string[]>([]);
  const [currentCulture, setCurrentCulture] = useState("");

  // Benefits And Perks
  const [benefitsAndPerks, setBenefitsAndPerks] = useState<string[]>([]);
  const [currentBenefit, setCurrentBenefit] = useState("");

  // Load data only when firm changes (very important → prevents infinite loop)
  useEffect(() => {
    if (!currentData?._id) return;

    // Logo / Cover preview
    if (currentData.coverImage) {
      setLogoPreview(currentData.coverImage);
    }

    // Tags
    if (Array.isArray(currentData.tags)) {
      setTags(currentData.tags);
    }

    // Internship Opportunities
    if (Array.isArray(currentData.internshipOpportunities)) {
      setInternshipOpportunities(currentData.internshipOpportunities);
    }

    // Culture And Value
    if (Array.isArray(currentData.cultureAndValue)) {
      setCultureAndValue(currentData.cultureAndValue);
    }

    // Benefits And Perks
    if (Array.isArray(currentData.benefitsAndPerks)) {
      setBenefitsAndPerks(currentData.benefitsAndPerks);
    }

  }, [currentData?._id]); // ← only run when the firm ID changes

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, coverImage: "File size must be less than 5MB" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, coverImage: "Please upload an image file" });
      return;
    }

    setErrors({ ...errors, coverImage: "" });
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    onChange("coverImage", file);
  };

  const addItem = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    field: string
  ) => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    const updated = [...items, trimmed];
    setItems(updated);
    onChange(field, updated);
    setInput("");
  };

  const removeItem = (
    index: number,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    field: string
  ) => {
    if (disabled) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(field, updated);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    addFn: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFn();
    }
  };

  // ──────────────────────────────
  //        VIEW MODE (Beautiful)
  // ──────────────────────────────
  if (view) {
    return (
      <div className="space-y-8 pb-6">
        {/* Hero / Header */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          {currentData.coverImage ? (
            <div className="relative h-64 md:h-80">
              <Image
              width={300}
              height={300}
                src={currentData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
              <Building size={120} className="text-white/30" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              {currentData.firmName || "Law Firm"}
            </h1>

            <div className="flex flex-wrap gap-4 mt-4">
              {currentData.location && (
                <div className="flex items-center gap-2 text-lg">
                  <MapPin size={20} /> {currentData.location}
                </div>
              )}
              {currentData.numberOfAttorneys != null && (
                <div className="flex items-center gap-2 text-lg">
                  <Users size={20} /> {currentData.numberOfAttorneys} Attorneys
                </div>
              )}
              {currentData.foundationYear && (
                <div className="flex items-center gap-2 text-lg">
                  <Calendar size={20} /> Founded {currentData.foundationYear}
                </div>
              )}
              {currentData.status && (
                <Badge
                  className={
                    currentData.status === "featured"
                      ? "bg-yellow-400 text-black text-lg px-4 py-1"
                      : currentData.status === "pending"
                      ? "bg-orange-500 text-white text-lg px-4 py-1"
                      : "bg-gray-700 text-white text-lg px-4 py-1"
                  }
                >
                  {currentData.status.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {currentData.aboutFirm && (
              <div>
                <h3 className="text-2xl font-bold mb-3">About the Firm</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentData.aboutFirm}
                </p>
              </div>
            )}

            {currentData.keyHighlights && (
              <div>
                <h3 className="text-2xl font-bold mb-3">Key Highlights</h3>
                <p className="text-gray-700">{currentData.keyHighlights}</p>
              </div>
            )}

            {currentData.internshipOpportunities?.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-3">Internship Opportunities</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {currentData.internshipOpportunities.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {currentData.tags?.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-3">Tags / Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {currentData.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-base px-4 py-1.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(currentData.website || currentData.email || currentData.phoneNumber) && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4 text-lg">
                  {currentData.website && (
                    <a
                      href={currentData.website.startsWith("http") ? currentData.website : `https://${currentData.website}`}
                      target="_blank"
                      className="flex items-center gap-3 text-blue-600 hover:underline"
                    >
                      <Globe size={22} />
                      {currentData.website}
                    </a>
                  )}
                  {currentData.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={22} className="text-gray-600" />
                      {currentData.email}
                    </div>
                  )}
                  {currentData.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone size={22} className="text-gray-600" />
                      {currentData.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────
  //     CREATE / EDIT MODE (Your original form)
  // ──────────────────────────────
  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Law Firm</TabsTrigger>
          <TabsTrigger value="positions">All Job Positions</TabsTrigger>
          <TabsTrigger value="culture">Culture & Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6 pt-6">
          {/* Logo / Cover Upload */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <label
                htmlFor="cover-upload"
                className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors bg-gray-50"
              >
                {logoPreview ? (
                  <Image
                    width={160}
                    height={160}
                    src={logoPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-base font-medium text-gray-700">Upload Cover Image</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
                id="cover-upload"
                disabled={disabled}
              />
            </div>
            {errors.coverImage && (
              <p className="text-sm text-red-500 mt-3">{errors.coverImage}</p>
            )}
          </div>

          {/* Firm Name */}
          <div className="space-y-2">
            <Label>Firm Name <span className="text-red-500">*</span></Label>
            <Input
              value={formData.firmName || ""}
              onChange={(e) => onChange("firmName", e.target.value)}
              placeholder="ABC Legal Associates"
              disabled={disabled}
            />
          </div>

          {/* About Firm */}
          <div className="space-y-2">
            <Label>About the Firm <span className="text-red-500">*</span></Label>
            <Textarea
              rows={4}
              value={formData.aboutFirm || ""}
              onChange={(e) => onChange("aboutFirm", e.target.value)}
              placeholder="Tell about your firm..."
              disabled={disabled}
            />
          </div>

          {/* Location • Founded • Employees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Location <span className="text-red-500">*</span></Label>
              <Input
                value={formData.location || ""}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Dhaka, Bangladesh"
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Founded Year <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={formData.foundationYear || ""}
                onChange={(e) => onChange("foundationYear", Number(e.target.value))}
                placeholder="1995"
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Attorneys</Label>
              <Input
                type="number"
                value={formData.numberOfAttorneys ?? ""}
                onChange={(e) => onChange("numberOfAttorneys", Number(e.target.value))}
                placeholder="25"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Website • Email • Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website || ""}
                onChange={(e) => onChange("website", e.target.value)}
                placeholder="https://www.example.com"
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="contact@firm.com"
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phoneNumber || ""}
                onChange={(e) => onChange("phoneNumber", e.target.value)}
                placeholder="+880 1711-223344"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags / Expertise</Label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => removeItem(index, tags, setTags, "tags")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Corporate Law, Litigation, Family Law..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => addItem(tags, setTags, currentTag, setCurrentTag, "tags"))}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => addItem(tags, setTags, currentTag, setCurrentTag, "tags")}
                disabled={disabled || !currentTag.trim()}
                className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="space-y-2">
            <Label>Key Highlights</Label>
            <Textarea
              rows={4}
              value={formData.keyHighlights || ""}
              onChange={(e) => onChange("keyHighlights", e.target.value)}
              placeholder="Top ranked, experienced team, client focused..."
              disabled={disabled}
            />
          </div>

          {/* Internship Opportunities */}
          <div className="space-y-2">
            <Label>Internship Opportunities</Label>
            {internshipOpportunities.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                {internshipOpportunities.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => removeItem(index, internshipOpportunities, setInternshipOpportunities, "internshipOpportunities")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Summer internship, 6-month training..."
                value={currentOpportunity}
                onChange={(e) => setCurrentOpportunity(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => addItem(internshipOpportunities, setInternshipOpportunities, currentOpportunity, setCurrentOpportunity, "internshipOpportunities"))}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => addItem(internshipOpportunities, setInternshipOpportunities, currentOpportunity, setCurrentOpportunity, "internshipOpportunities")}
                disabled={disabled || !currentOpportunity.trim()}
                className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <h1>Culture & Benefits</h1>

          {/* Culture And Value - SEPARATE */}
          <div className="space-y-2">
            <Label>Culture And Value</Label>
            {cultureAndValue.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                {cultureAndValue.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => removeItem(index, cultureAndValue, setCultureAndValue, "cultureAndValue")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Teamwork, Innovation, Integrity..."
                value={currentCulture}
                onChange={(e) => setCurrentCulture(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => addItem(cultureAndValue, setCultureAndValue, currentCulture, setCurrentCulture, "cultureAndValue"))}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => addItem(cultureAndValue, setCultureAndValue, currentCulture, setCurrentCulture, "cultureAndValue")}
                disabled={disabled || !currentCulture.trim()}
                className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Benefits And Perks - SEPARATE */}
          <div className="space-y-2">
            <Label>Benefits And Perks</Label>
            {benefitsAndPerks.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                {benefitsAndPerks.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => removeItem(index, benefitsAndPerks, setBenefitsAndPerks, "benefitsAndPerks")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Health Insurance, Flexible Hours, Remote Work..."
                value={currentBenefit}
                onChange={(e) => setCurrentBenefit(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => addItem(benefitsAndPerks, setBenefitsAndPerks, currentBenefit, setCurrentBenefit, "benefitsAndPerks"))}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => addItem(benefitsAndPerks, setBenefitsAndPerks, currentBenefit, setCurrentBenefit, "benefitsAndPerks")}
                disabled={disabled || !currentBenefit.trim()}
                className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </TabsContent>

        {/* You can keep other tabs empty or add later */}
      </Tabs>
    </div>
  );
};

export default CreateLawFields;