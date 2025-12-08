import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Zap,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";

const HelpSupportPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const quickLinks = [
    {
      title: "Getting Started",
      description: "Learn the basics of using the CRM",
      icon: Zap,
      color: "blue",
    },
    {
      title: "Managing Clients",
      description: "Add, edit, and organize your clients",
      icon: Users,
      color: "green",
    },
    {
      title: "Deals & Pipeline",
      description: "Track and manage your sales pipeline",
      icon: Briefcase,
      color: "purple",
    },
    {
      title: "Reports & Analytics",
      description: "Generate insights from your data",
      icon: BarChart3,
      color: "orange",
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I add a new client?",
      answer:
        "Navigate to the Clients page and click the 'Add Client' button. Fill in the required information such as name, email, and company, then click Save to create the new client record.",
    },
    {
      id: 2,
      question: "How can I track my deals?",
      answer:
        "Go to the Deals page to view all your deals. You can filter by status, sort by value, and click on any deal to see detailed information. Use the pipeline view to visualize your sales stages.",
    },
    {
      id: 3,
      question: "How do I generate reports?",
      answer:
        "Visit the Reports page to access pre-built reports or create custom ones. You can export reports in various formats and schedule automated report delivery.",
    },
    {
      id: 4,
      question: "Can I import existing data?",
      answer:
        "Yes, you can import data from CSV files. Go to Settings > Import Data, download the template, fill in your data, and upload the file. The system will validate and import your records.",
    },
    {
      id: 5,
      question: "How do I manage user permissions?",
      answer:
        "User permissions can be managed in Settings > Team Management. You can assign roles like Admin, Manager, or User, each with different access levels to features and data.",
    },
    {
      id: 6,
      question: "Is my data secure?",
      answer:
        "Yes, we use industry-standard encryption for all data. Your information is stored securely with regular backups. We also support two-factor authentication for added security.",
    },
  ];

  const resources = [
    {
      title: "User Guide",
      description: "Complete documentation for all features",
      icon: Book,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      icon: FileText,
      link: "#",
    },
    {
      title: "API Documentation",
      description: "Developer resources and API reference",
      icon: Settings,
      link: "#",
    },
    {
      title: "Security & Privacy",
      description: "Learn about our security practices",
      icon: Shield,
      link: "#",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colorClasses = {
    blue: {
      bg: "bg-[#FEFDFC]",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-[#FEFDFC]",
      text: "text-green-600",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-[#FEFDFC]",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    orange: {
      bg: "bg-[#FEFDFC]",
      text: "text-orange-600",
      border: "border-orange-200",
    },
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2f362f] mb-3">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#2f362f]/60 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Help & Support</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#2f362f] mb-2 tracking-tight">
              Help & Support
            </h1>
            <p className="text-[#2f362f] text-lg">
              Find answers, resources, and get in touch with our team
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2f362f]/80" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#FEFDFC] text-[#2f362f]"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#2f362f] mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => {
            const colors = colorClasses[link.color];
            return (
              <div
                key={index}
                className="bg-[#FEFDFC] rounded-lg p-5 shadow-sm border border-[#BCC8BC] hover:shadow-md transition-all cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4  transition-transform`}
                >
                  <link.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="font-semibold text-[#2f362f] mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-[#2f362f]/70">{link.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-[#2f362f]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-[#BCC8BC] rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                      className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-[#2f362f]">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-2.5 pb-4 text-[#2f362f]/80 text-sm leading-relaxed border-t border-[#BCC8BC] pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-[#2f362f]/60 py-8">
                  No results found for "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact & Resources */}
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-[#2f362f]">
                Contact Support
              </h2>
            </div>
            <p className="text-sm text-[#2f362f]/70 mb-4">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:support@example.com"
                className="flex items-center gap-3 p-2.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-[#2f362f]">
                    Email Support
                  </p>
                  <p className="text-xs text-[#2f362f]/60">
                    support@example.com
                  </p>
                </div>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 p-2.5 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-[#2f362f]">
                    Phone Support
                  </p>
                  <p className="text-xs text-[#2f362f]/60">+1 (234) 567-890</p>
                </div>
              </a>
            </div>
            <button className="w-full mt-4 px-2.5 py-2 bg-[#2f362f] text-white rounded-lg font-medium hover:bg-[#2f362f]/90 transition-colors">
              Start Live Chat
            </button>
          </div>

          {/* Resources */}
          <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-[#2f362f]">Resources</h2>
            </div>
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <resource.icon className="w-4 h-4 text-[#2f362f]/60" />
                    <div>
                      <p className="text-sm font-medium text-[#2f362f]">
                        {resource.title}
                      </p>
                      <p className="text-xs text-[#2f362f]/60">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#2f362f]/40 group-hover:text-[#2f362f]/60" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
