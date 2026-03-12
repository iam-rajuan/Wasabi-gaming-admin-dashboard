"use client";
import React from "react";
import { Mail, Phone, Building, Calendar, Globe, Crown, CheckCircle, Smartphone } from "lucide-react";

interface SchoolDetailsFieldsProps {
    formData: any;
}

const SchoolDetailsFields: React.FC<SchoolDetailsFieldsProps> = ({ formData }) => {
    // Handle various nesting levels from the single-user API response
    const subscription =
        formData.subscribedSchool ||
        formData.subscription?.subscription ||
        formData.subscription ||
        null;

    return (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Header Info */}
            <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm shrink-0">
                    {formData.profileImage ? (
                        <img src={formData.profileImage} alt="profile" className="h-full w-full object-cover" />
                    ) : (
                        <Building className="text-gray-400 h-10 w-10" />
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {formData.schoolName || formData.name || "Unnamed School"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${formData.schoolStatus === "accepted" ? "bg-green-100 text-green-700" :
                            formData.schoolStatus === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {formData.schoolStatus || "pending"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{formData.role}</span>
                    </div>
                </div>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase ml-1">Contact Information</p>
                    <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="truncate">{formData.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-green-500" />
                            <span>{formData.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Smartphone className="h-4 w-4 text-purple-500" />
                            <span>{formData.authType || "Manual"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Section */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase ml-1">Subscription Details</p>
                <div className={`p-5 rounded-2xl border-2 transition-all ${subscription ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200" : "bg-gray-50 border-gray-100 border-dashed"
                    }`}>
                    {subscription ? (
                        <div className="relative">
                            <div className="absolute -top-1 -right-1">
                                <Crown className="h-8 w-8 text-purple-500 opacity-20" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Crown className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-purple-900 uppercase text-sm tracking-widest">{subscription.name} Plan</h4>
                                    <p className="text-xs text-purple-600 font-medium">Active Subscription</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-gray-900">£{subscription.price}</span>
                                <span className="text-gray-500 text-sm font-medium">/{subscription.type}</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-700 uppercase mb-2">Included Features:</p>
                                {subscription.features?.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-white/50 p-2 rounded-lg border border-purple-100">
                                        <CheckCircle className="h-4 w-4 text-purple-600 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 text-center">
                            <p className="text-gray-400 text-sm font-medium">No active subscription found for this school.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchoolDetailsFields;
