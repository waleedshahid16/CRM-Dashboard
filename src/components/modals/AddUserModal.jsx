/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addClient, updateClient } from "../../store/slices/clientsSlice";
import { X, Upload, Star, Plus } from "lucide-react";

const clientSchema = yup
  .object({
    firstName: yup
      .string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: yup
      .string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    jobTitle: yup.string().required("Job title is required"),
    company: yup.string().required("Company is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid email address"),
    phone1: yup.string().required("Phone 1 is required"),
    phone2: yup.string().nullable(),
    fax: yup.string().nullable(),
    dateOfBirth: yup.date().nullable(),
    owner: yup.string().nullable(),
    description: yup.string().required("Description is required"),
    emailOptOut: yup.boolean(),
    tags: yup.array().of(yup.string()),
    deals: yup.string().nullable(),
    reviews: yup.number().min(0).max(5).nullable(),
  })
  .required();

const clientDefaultValues = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  company: "",
  email: "",
  phone1: "",
  phone2: "",
  fax: "",
  dateOfBirth: null,
  owner: "",
  description: "",
  emailOptOut: false,
  tags: [],
  deals: "",
  reviews: 0,
  avatar: "",
};

const AddUserModal = ({ open, onClose, initialData = null, mode = "add" }) => {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: clientDefaultValues,
  });

  const tags = watch("tags") || [];

  const owners = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];

  useEffect(() => {
    if (open) {
      if (initialData) {
        const nameParts = initialData.name
          ? initialData.name.split(" ")
          : ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        reset({
          ...clientDefaultValues,
          ...initialData,
          firstName: initialData.firstName || firstName,
          lastName: initialData.lastName || lastName,
        });

        if (initialData.avatar) {
          setAvatarPreview(initialData.avatar);
        }
      } else {
        reset(clientDefaultValues);
        setAvatarPreview(null);
      }
    }
  }, [open, initialData, reset]);

  const isEdit = mode === "edit" && initialData;

  const handleClose = () => {
    reset(clientDefaultValues);
    setAvatarPreview(null);
    setTagInput("");
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 800 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setValue("avatar", reader.result);
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
      const fullName = `${data.firstName} ${data.lastName}`;
      // Remove source, currency, language, industry if they exist
      const { source, currency, language, industry, ...cleanData } = data;
      const clientData = {
        ...cleanData,
        name: fullName,
        phone: data.phone1,
        joinDate:
          initialData?.joinDate || new Date().toISOString().split("T")[0],
        lastActive: initialData?.lastActive || "Just now",
      };

      if (isEdit) {
        // Remove source, currency, language, industry from initialData as well
        const { source: _, currency: __, language: ___, industry: ____, ...cleanInitialData } = initialData || {};
        dispatch(updateClient({ ...cleanInitialData, ...clientData }));
      } else {
        dispatch(addClient(clientData));
      }
      handleClose();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#f8faf9] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="bg-blue-200 p-6 text-[#2f362f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border-3 border-white/30 flex items-center justify-center text-2xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {`${firstName.charAt(0)}${lastName.charAt(0)}` || "👤"}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEdit ? "Edit Contact" : "Add New Contact"}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  {isEdit
                    ? "Update the contact information"
                    : "Create a new contact in your CRM system"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FEFDFC]">
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-[#BCC8BC] rounded-xl bg-[#FEFDFC] flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-[#2f362f]" />
                )}
              </div>
              <div>
                <input
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="avatar-upload">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                    className="px-3 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-[#2f362f] rounded-md font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 text-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
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
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="John"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="Doe"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="Sales Manager"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.jobTitle
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.jobTitle.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.company ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Tech Innovations Ltd">
                          Tech Innovations Ltd
                        </option>
                        <option value="Green Energy Solutions">
                          Green Energy Solutions
                        </option>
                        <option value="Healthcare Plus">Healthcare Plus</option>
                        <option value="Finance Pro Services">
                          Finance Pro Services
                        </option>
                        <option value="EduTech Academy">EduTech Academy</option>
                        <option value="Retail Mart Group">
                          Retail Mart Group
                        </option>
                        <option value="AutoDrive Corporation">
                          AutoDrive Corporation
                        </option>
                        <option value="Construction Masters">
                          Construction Masters
                        </option>
                        <option value="Digital Marketing Hub">
                          Digital Marketing Hub
                        </option>
                      </select>
                      {errors.company && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.company.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Email with Opt Out */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#2f362f]">
                    Email <span className="text-red-500">*</span>
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
                          <div className="w-11 h-6 bg-[#FEFDFC] rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
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
                        type="email"
                        placeholder="john@example.com"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
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
                  Phone 1 <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="phone1"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        type="tel"
                        placeholder="(201) 555-0123"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.phone1 ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.phone1 && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone1.message}
                        </p>
                      )}
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
                    <input
                      {...field}
                      type="tel"
                      placeholder="(201) 555-0123"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
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
                      placeholder="Fax number"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  )}
                />
              </div>

              {/* Deals */}
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
                <Controller
                  name="deals"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select</option>
                      <option value="deal1">Enterprise Software License</option>
                      <option value="deal2">Cloud Infrastructure Setup</option>
                      <option value="deal3">Digital Marketing Campaign</option>
                    </select>
                  )}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Date of Birth
                </label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      type="date"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  )}
                />
              </div>

              {/* Reviews */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Reviews
                </label>
                <Controller
                  name="reviews"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        value={field.value || ""}
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="0-5"
                        className="w-full px-2.5 py-2 pr-10 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <Star className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                />
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
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                  placeholder="Enter tag and press Enter"
                  className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                <p className="text-xs text-[#2f362f] mt-1">
                  Enter tags separated by comma
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <textarea
                        {...field}
                        rows={4}
                        placeholder="Enter description"
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                          errors.description
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-white flex justify-end gap-3">
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
            className="px-2.5 py-2 bg-blue-200 border-[#BCC8BC] text-[#2f362f] rounded-md font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Adding..."
              : isEdit
              ? "Save Changes"
              : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
