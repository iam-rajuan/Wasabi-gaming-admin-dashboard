"use client";
import React, { useState } from "react";

const LawFirmProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const YellowSeparator = ({ url, label }) => {
    if (!url) return null;
    
    return (
      <div className="my-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between text-yellow-800 hover:text-yellow-900 transition-colors duration-200"
        >
          <span className="font-medium">🔗 {label}</span>
          <span className="text-sm opacity-75">Visit relevant section →</span>
        </a>
      </div>
    );
  };

  const tabs = {
    overview: {
      title: "Firm Overview",
      content: (
        <div className="space-y-8">

          <div>
    
            <p className="text-sm text-gray-600 leading-relaxed">
              Sullivan & Cromwell LLP is a leading international law firm with a reputation for excellence 
              in complex transactions, litigation, and regulatory matters. For over 140 years, we have 
              advised clients on their most challenging legal issues, combining deep industry knowledge 
              with innovative legal solutions.
            </p>
          </div>

        
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Establishment</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Founded in 1879 in New York City by Algernon Sydney Sullivan and William Nelson Cromwell. 
              The firm has grown from a small partnership to one of the world's most prestigious law firms, 
              maintaining a commitment to excellence and client service across generations.
            </p>
          </div>

     
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Office Locations</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <li>📍 New York (Headquarters)</li>
              <li>📍 Washington, D.C.</li>
              <li>📍 Los Angeles</li>
              <li>📍 Palo Alto</li>
              <li>📍 London</li>
              <li>📍 Frankfurt</li>
              <li>📍 Paris</li>
              <li>📍 Beijing</li>
              <li>📍 Hong Kong</li>
              <li>📍 Melbourne</li>
              <li>📍 Tokyo</li>
              <li>📍 Dubai</li>
            </ul>
          </div>

      
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Annual Revenue</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-gray-800">$2.1 Billion (2024)</p>
              <p className="text-sm text-gray-600 mt-2">PPP (Profit Per Partner): $6.2M</p>
              <p className="text-sm text-gray-600">Revenue Growth: 8.5% YoY</p>
            </div>
          </div>

       
          <YellowSeparator 
            url="https://www.sullcrom.com/about/highlights" 
            label="Key Highlights"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Highlights</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>✅ #1 in M&A Deal Volume for 5 consecutive years</li>
              <li>✅ 850+ Attorneys worldwide</li>
              <li>✅ 200+ Partners with 20+ years average experience</li>
              <li>✅ Represents 75% of Fortune 100 companies</li>
              <li>✅ 40+ practice areas across all major industries</li>
              <li>✅ 95% client retention rate over 10 years</li>
            </ul>
          </div>


          <YellowSeparator 
            url="https://www.sullcrom.com/practices" 
            label="Practice Areas"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Areas</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Mergers & Acquisitions", "Capital Markets", "Private Equity", 
                "Litigation & Arbitration", "White Collar Defense", "Antitrust",
                "Intellectual Property", "Tax", "Environmental Law", "Financial Regulation",
                "Restructuring", "Real Estate", "Cybersecurity", "Blockchain & Digital Assets",
                "Healthcare & Life Sciences", "Energy & Infrastructure"
              ].map((area) => (
                <span
                  key={area}
                  className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

  
          <YellowSeparator 
            url="https://www.sullcrom.com/our-work" 
            label="Recent Work"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Work</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="font-medium">$85B Tech Merger</p>
                <p className="text-gray-500">Advised on largest tech merger of 2024</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="font-medium">Landmark Supreme Court Case</p>
                <p className="text-gray-500">Successfully argued before SCOTUS on privacy rights</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="font-medium">Major IPO Representation</p>
                <p className="text-gray-500">Lead counsel for $15B biotech IPO</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    initiatives: {
      title: "Initiatives & Recognition",
      content: (
        <div className="space-y-8">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Initiatives</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>🤖 AI-powered document review system reducing review time by 70%</li>
              <li>🔐 Blockchain-based contract management platform</li>
              <li>📊 Advanced data analytics for case prediction</li>
              <li>💻 Virtual reality courtroom preparation tools</li>
              <li>☁️ Secure cloud collaboration platform for clients</li>
            </ul>
          </div>

          <YellowSeparator 
            url="https://www.sullcrom.com/about/awards" 
            label="Awards and Recognition"
          />
       
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Awards and Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">2024 Awards</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>🏆 Law Firm of the Year - Chambers Global</li>
                  <li>🏆 Best for Client Service - Financial Times</li>
                  <li>🏆 Top 10 Most Innovative Law Firms</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Practice Awards</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>⭐ #1 in M&A - Legal 500</li>
                  <li>⭐ Band 1 Litigation - Chambers USA</li>
                  <li>⭐ Top Tier Capital Markets</li>
                </ul>
              </div>
            </div>
          </div>


          <YellowSeparator 
            url="https://www.sullcrom.com/diversity" 
            label="Diversity, Equity & Inclusion"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Diversity, Equity & Inclusion</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">45%</p>
                <p className="text-sm text-purple-600">Women Partners</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">32%</p>
                <p className="text-sm text-purple-600">Ethnic Diversity</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">18%</p>
                <p className="text-sm text-purple-600">LGBTQ+ Representation</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Comprehensive DE&I programs including mentorship, affinity groups, and inclusive hiring practices.
            </p>
          </div>

  
          <YellowSeparator 
            url="https://www.sullcrom.com/probono" 
            label="CSR and Pro Bono"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CSR and Pro Bono</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">🌱 Environmental Sustainability</p>
                <p>Carbon neutral since 2022, 100% renewable energy in offices</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">⚖️ Pro Bono Hours</p>
                <p>150,000+ hours annually, $50M+ in pro bono legal services</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">🏛️ Community Engagement</p>
                <p>Partnerships with 50+ non-profits and legal aid organizations</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="bg-gray-50 flex justify-center  h-[79vh] overflow-y-auto">
      <div className="w-full max-w-6xl  h-[79vh] overflow-y-auto  bg-white rounded-xl shadow-sm overflow-hidden">
    
        <div className="relative bg-gradient-to-r from-blue-900 to-gray-900 px-4 pt-6 pb-20">

          <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center">
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
          ⚖️
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pt-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Sullivan & Cromwell LLP
          </h1>
          <p className="text-gray-500 mt-1">Global Legal Excellence Since 1879</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-4">
            <span className="flex items-center gap-1">
              📍 12 Global Offices
            </span>
            <span className="flex items-center gap-1">
              👥 850+ Attorneys
            </span>
            <span className="flex items-center gap-1">
              🏢 Founded 1879
            </span>
            <span className="flex items-center gap-1">
              💼 200+ Partners
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {["M&A", "Capital Markets", "Litigation", "Private Equity", "Regulatory", "Tech", "Finance", "International"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 bg-gray-50 rounded-lg p-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer">
              🌐 www.sullcrom.com
            </div>
            <div className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer">
              ✉️ info@sullcrom.com
            </div>
            <div className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer">
              📞 (212) 558-4000
            </div>
          </div>

          <div className="mt-8 border-b flex gap-6 text-sm">
            <button
              onClick={() => handleTabClick("overview")}
              className={`pb-2 border-b-2 transition-all duration-200 font-medium ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Firm Overview
            </button>
            <button
              onClick={() => handleTabClick("initiatives")}
              className={`pb-2 border-b-2 transition-all duration-200 font-medium ${
                activeTab === "initiatives"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Initiatives & Recognition
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">
                {tabs[activeTab].title}
              </h2>
              {tabs[activeTab].content}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t py-6 text-center text-xs text-gray-400">
          © 2025 Legal Firm Directory – Comprehensive Law Firm Profiles
          <div className="flex justify-center gap-4 mt-2">
            <span className="hover:text-gray-600 cursor-pointer transition-colors duration-200">
              Privacy Policy
            </span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors duration-200">
              Terms of Service
            </span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors duration-200">
              Contact Directory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawFirmProfilePage;