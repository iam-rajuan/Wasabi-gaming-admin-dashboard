import React from "react";
import { ArrowLeft } from "lucide-react";

interface PortfollioViewProps {
    data?: any;
    onBack?: () => void;
}

const PortfollioView: React.FC<PortfollioViewProps> = ({ data = {}, onBack }) => {
    return (
        <div className="space-y-4 h-[79vh] overflow-y-auto">
            {/* Banner Image */}
            <div className="relative rounded-lg overflow-hidden">
                <img
                    src={
                        data.imagePreview ||
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                    }
                    alt="Event Banner"
                    className="w-full h-64 object-cover"
                />

                {/* Back Button */}

            </div>

            {/* Content Card */}
            <div className="bg-white border rounded-lg p-5 space-y-4">
                {/* Date & Time */}
                <p className="text-xs text-gray-500">
                    {data.date || "Tuesday, Mar 18"} •{" "}
                    {data.time || "12:00 PM UTC"}
                </p>

                {/* Title */}
                <h1 className="text-lg font-semibold text-gray-900">
                    {data.title ||
                        "1:1 Mock Interview with Current Legal Apprentices"}
                </h1>

                {/* Subtitle */}
                {data.subtitle && (
                    <p className="text-sm text-gray-600">
                        {data.subtitle}
                    </p>
                )}

                {/* Rich Content */}
                <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                        __html:
                            data.content ||
                            `<p>We’re excited to announce that registration is now open for our mock interviews with current solicitor apprentices!</p>
                             <ul>
                                <li>Gain real-life interview experience</li>
                                <li>Receive personalised feedback</li>
                                <li>Boost your confidence for future interviews</li>
                             </ul>
                             <p><strong>Registration Deadline:</strong> 18th March 2025</p>`,
                    }}
                />
            </div>
        </div>
    );
};

export default PortfollioView;
