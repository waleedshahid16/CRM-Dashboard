/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addCompany, updateCompany } from "../../store/slices/companiesSlice";
import { X, Upload, Building2, Plus } from "lucide-react";

const companySchema = yup
  .object({
    name: yup
      .string()
      .required("Company name is required")
      .min(2, "Name must be at least 2 characters"),
    industry: yup.string().required("Industry is required"),
    website: yup.string().url("Enter a valid URL").nullable(),
    companySize: yup.string().required("Company size is required"),
    annualRevenue: yup.string().required("Annual revenue is required"),
    status: yup
      .string()
      .oneOf(["Prospect", "Active", "Inactive"])
      .required("Status is required"),
    email: yup.string().email("Enter a valid email address").nullable(),
    phone1: yup.string().nullable(),
    phone2: yup.string().nullable(),
    fax: yup.string().nullable(),
    owner: yup.string().nullable(),
    source: yup.string().nullable(),
    tags: yup.array().of(yup.string()),
    description: yup.string().nullable(),
    emailOptOut: yup.boolean(),
  })
  .required();

const companyDefaultValues = {
  name: "",
  industry: "",
  website: "",
  companySize: "",
  annualRevenue: "",
  status: "Prospect",
  email: "",
  phone1: "",
  phone2: "",
  fax: "",
  owner: "",
  source: "Website",
  tags: [],
  description: "",
  emailOptOut: false,
  logo: "",
};

const AddCompanyModal = ({
  open,
  onClose,
  initialData = null,
  mode = "add",
}) => {
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: companyDefaultValues,
  });

  const tags = watch("tags") || [];
  const companyName = watch("name") || "";

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Consulting",
    "Media",
    "Transportation",
    "Other",
  ];

  const companySizes = [
    "1-10",
    "10-50",
    "50-200",
    "200-500",
    "500-1000",
    "1000+",
  ];

  const annualRevenues = [
    "Less than $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $50M",
    "$50M - $100M",
    "$100M+",
  ];

  const sources = [
    "Website",
    "Referral",
    "Social Media",
    "Email Campaign",
    "Cold Call",
    "Event",
    "Partner",
    "Other",
  ];

  const owners = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          ...companyDefaultValues,
          ...initialData,
        });
        if (initialData.logo) {
          setLogoPreview(initialData.logo);
        }
      } else {
        reset(companyDefaultValues);
        setLogoPreview(null);
      }
    }
  }, [open, initialData, reset]);

  const isEdit = mode === "edit" && initialData;

  const handleClose = () => {
    reset(companyDefaultValues);
    setLogoPreview(null);
    setTagInput("");
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 800 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setValue("logo", reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("File size must be less than 800KB");
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToDelete)
    );
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        dispatch(updateCompany({ ...initialData, ...data }));
      } else {
        dispatch(addCompany(data));
      }
      handleClose();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#f8faf9] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="bg-blue-200 p-6 text-[#2f362f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-14 h-14 rounded-full border-3 border-[#2f362f] flex items-center justify-center text-2xl font-bold overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-7 h-7" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEdit ? "Edit Company" : "Add New Company"}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  {isEdit
                    ? "Update the company information"
                    : "Create a new company in your CRM system"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8faf9]">
          <div className="space-y-4">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-[#BCC8BC] rounded-xl bg-[#FEFDFC] flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <input
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="logo-upload">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("logo-upload").click()
                    }
                    className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload file
                  </button>
                </label>
                <p className="text-xs text-[#2f362f] mt-1">
                  JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="Acme Corporation"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Email with Opt Out */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#2f362f]">
                    Email
                  </label>
                  <Controller
                    name="emailOptOut"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm text-[#2f362f]">
                          Email Opt-Out
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#FEFDFC] rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="email"
                        placeholder="info@acme.com"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Phone 1 */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Phone 1
                </label>
                <Controller
                  name="phone1"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-sm text-[#2f362f] pr-1">
                        <option>🇺🇸</option>
                      </select>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="tel"
                        placeholder="(201) 555-0123"
                        className="w-full pl-14 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Phone 2 */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Phone 2
                </label>
                <Controller
                  name="phone2"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-sm text-[#2f362f] pr-1">
                        <option>🇺🇸</option>
                      </select>
                      <input
                        {...field}
                        value={field.value || ""}
                        type="tel"
                        placeholder="(201) 555-0123"
                        className="w-full pl-14 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Fax */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Fax
                </label>
                <Controller
                  name="fax"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      placeholder="Fax number"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  )}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Website
                </label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        value={field.value || ""}
                        placeholder="acme.com"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.website ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.website && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Reviews (placeholder) */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Reviews
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0-5"
                    className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ⭐
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Owner
                </label>
                <Controller
                  name="owner"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      value={field.value || ""}
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select</option>
                      {owners.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Tags
                </label>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Enter value separated by comma"
                  className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Deals (placeholder) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#2f362f]">
                    Deals
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add New
                  </button>
                </div>
                <select className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="">Select</option>
                  <option>Enterprise Software License</option>
                  <option>Cloud Infrastructure Setup</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {sources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.industry
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.industry.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="companySize"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.companySize
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      {errors.companySize && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.companySize.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Annual Revenue */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Annual Revenue <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="annualRevenue"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.annualRevenue
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select</option>
                        {annualRevenues.map((revenue) => (
                          <option key={revenue} value={revenue}>
                            {revenue}
                          </option>
                        ))}
                      </select>
                      {errors.annualRevenue && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.annualRevenue.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Prospect">Prospect</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  )}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      value={field.value || ""}
                      rows={4}
                      placeholder="Enter description"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#BCC8BC] p-6 bg-[#FEFDFC] flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-2.5 py-2 border-2 border-[#BCC8BC] text-[#2f362f] rounded-md font-semibold hover:bg-slate-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Adding..."
              : isEdit
              ? "Save Changes"
              : "Add Company"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
