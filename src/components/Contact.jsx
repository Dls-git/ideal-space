import { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const INQUIRY_API_URL = "http://localhost:3000/api/inquiry";

const initialFormData = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  site_location: "",
  worker_numbers: 2,
  start_date: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneAllowedRegex = /^[\d\s()+-]+$/;
const START_DATE_PLACEHOLDER = "yyyy/MM/dd";
const isDevEnvironment = import.meta.env.DEV;

const formatDateToSlash = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const parseSlashDateToDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("/").map(Number);
  if (!year || !month || !day) return null;
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
};

const extractApiValidation = (apiValidationErrors) => {
  const fieldErrors = {};
  const messages = [];

  const addMessage = (message, fieldKey) => {
    if (!message || typeof message !== "string") return;
    if (fieldKey && !fieldErrors[fieldKey]) {
      fieldErrors[fieldKey] = message;
    }
    messages.push(message);
  };

  if (Array.isArray(apiValidationErrors)) {
    apiValidationErrors.forEach((item) => {
      if (typeof item === "string") {
        addMessage(item);
        return;
      }
      if (!item || typeof item !== "object") return;

      const fieldKey = typeof item.property === "string" ? item.property : "";
      if (item.constraints && typeof item.constraints === "object") {
        Object.values(item.constraints).forEach((constraintMessage) => addMessage(constraintMessage, fieldKey));
        return;
      }
      if (typeof item.message === "string") {
        addMessage(item.message, fieldKey);
      }
    });
  } else if (apiValidationErrors && typeof apiValidationErrors === "object") {
    Object.entries(apiValidationErrors).forEach(([fieldKey, value]) => {
      if (Array.isArray(value)) {
        value.forEach((message) => addMessage(message, fieldKey));
      } else if (typeof value === "string") {
        addMessage(value, fieldKey);
      }
    });
  }

  return { fieldErrors, validationMessage: [...new Set(messages)].join(" ") };
};

const CalendarInput = forwardRef(function CalendarInput(
  { value, onClick, onBlur, hasError, placeholder = START_DATE_PLACEHOLDER },
  ref
) {
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      onBlur={onBlur}
      className={`flex w-full items-center justify-between rounded-2xl border bg-white/[0.04] px-4 py-3 text-left text-white outline-none transition focus-visible:border-[#c19a6b] ${
        hasError ? "border-red-500" : "border-white/10"
      }`}
    >
      <span className={value ? "text-white" : "text-white/25"}>{value || placeholder}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-[#c19a6b]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M4 10h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      </svg>
    </button>
  );
});

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);

  const inquiryFields = [
    { key: "company_name", label: "Company Name", type: "text", placeholder: "Your company name" },
    { key: "contact_person", label: "Contact Person", type: "text", placeholder: "Full name" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "Best contact number" },
    { key: "email", label: "Email", type: "email", placeholder: "Work email" },
    { key: "site_location", label: "Site Location", type: "text", placeholder: "Project address or suburb" },
    { key: "worker_numbers", label: "Number of Workers Required", type: "number", placeholder: "e.g. 2", min: 2 },
    { key: "start_date", label: "Start Date", type: "text", placeholder: START_DATE_PLACEHOLDER },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };
  const closeRateLimitModal = () => {
    setIsRateLimitModalOpen(false);
    setRateLimitMessage("");
  };
  const fieldLabelMap = inquiryFields.reduce((acc, field) => {
    acc[field.key] = field.label;
    return acc;
  }, {});

  useEffect(() => {
    if (!isSuccessModalOpen && !isRateLimitModalOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isRateLimitModalOpen) {
          closeRateLimitModal();
        } else if (isSuccessModalOpen) {
          closeSuccessModal();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRateLimitModalOpen, isSuccessModalOpen]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.company_name.trim()) {
      nextErrors.company_name = "Company name is required.";
    }
    if (!formData.contact_person.trim()) {
      nextErrors.contact_person = "Contact person is required.";
    }
    if (formData.phone.trim()) {
      if (/[a-zA-Z]/.test(formData.phone)) {
        nextErrors.phone = "Phone number cannot contain English letters.";
      } else if (!phoneAllowedRegex.test(formData.phone)) {
        nextErrors.phone = "Please enter a valid phone number.";
      }
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    const workerCount = Number(formData.worker_numbers);
    if (!Number.isFinite(workerCount) || workerCount < 2) {
      nextErrors.worker_numbers = "Worker numbers must be at least 2.";
    }
    if (formData.start_date) {
      const startDate = parseSlashDateToDate(formData.start_date);
      if (!startDate) {
        nextErrors.start_date = "Please select a valid date.";
      } else if (startDate < today) {
        nextErrors.start_date = "Start date cannot be earlier than today.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const parsedValue = field === "worker_numbers" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [field]: parsedValue }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError("");
    setSuccessMessage("");
    setRateLimitMessage("");
    setIsRateLimitModalOpen(false);

    try {
      const response = await axios.post(INQUIRY_API_URL, {
        ...formData,
        worker_numbers: Number(formData.worker_numbers),
        start_date: formData.start_date ? formData.start_date.replaceAll("/", "-") : "",
      });
      setFormData(initialFormData);
      setErrors({});
      setSuccessMessage(response.data?.message || "Inquiry sent successfully. We'll contact you shortly.");
      setIsSuccessModalOpen(true);
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.message;
      const apiError = error.response?.data?.error;
      const apiValidationErrors = error.response?.data?.errors;
      const retryAfterHeader = error.response?.headers?.["retry-after"];
      const { fieldErrors, validationMessage } = extractApiValidation(apiValidationErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      const combinedErrorText = `${apiMessage || ""} ${apiError || ""}`.toLowerCase();
      const isRateLimited =
        !isDevEnvironment &&
        (status === 429 ||
          combinedErrorText.includes("rate limit") ||
          combinedErrorText.includes("too many requests"));
      const retryAfterText =
        retryAfterHeader && Number.isFinite(Number(retryAfterHeader))
          ? ` Please try again in ${retryAfterHeader} seconds.`
          : "";

      if (isRateLimited) {
        setSubmitError("");
        setRateLimitMessage(
          apiMessage || apiError || `You've sent requests too quickly.${retryAfterText || " Please wait a moment and try again."}`
        );
        setIsRateLimitModalOpen(true);
      } else if (status) {
        const detailedMessage =
          validationMessage ||
          apiError ||
          (apiMessage === "Validation failed." ? "Validation failed. Please check the highlighted fields." : "");
        setSubmitError(detailedMessage || apiMessage || "Unable to submit right now. Please try again.");
      } else {
        setSubmitError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message));

  return (
    <>
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 xl:px-10 min-[1700px]:max-w-[92rem]">
        <div className="grid gap-6 rounded-[2rem] border border-[#c9a35d]/20 bg-gradient-to-br from-[#151515] to-[#0d0d0d] p-5 sm:gap-8 sm:p-8 md:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:p-14 min-[1700px]:gap-12">
          <div className="space-y-5">
            <div className={sectionTitle}>Contact</div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              Need reliable plaster manpower for your next project?
            </h2>
            <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Contact Ideal Space Solutions directly, or submit a short manpower inquiry. The form is intentionally minimal so contractors can send the essential information fast.
            </p>

            <div className="space-y-5 rounded-[1.75rem] border border-white/10 bg-black/30 p-6 sm:p-8">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Phone</div>
                <a href="tel:0434082628" className="mt-2 block text-2xl font-medium text-white">
                  0434 082 628
                </a>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Email</div>
                <a href="mailto:hello@idealspace.au" className="mt-2 block break-all text-xl text-white sm:break-normal">
                  hello@idealspace.au
                </a>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Service Area</div>
                <div className="mt-2 text-xl text-white">Melbourne</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.25em] text-[#c9a35d]">Quick Inquiry</div>
              <p className="mt-3 text-white/70">
                If you have any questions or enquiries please feel free to contact us on the following details provided below or alternatively you can complete our online enquiry form and we will get back to you as soon as possible..
              </p>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              {errorEntries.length > 0 && (
                <div className="md:col-span-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                  <p className="font-medium text-red-300">Please fix the following fields:</p>
                  <ul className="mt-2 space-y-1 text-red-200">
                    {errorEntries.map(([fieldKey, message]) => (
                      <li key={fieldKey}>
                        {fieldLabelMap[fieldKey] || fieldKey}: {message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {inquiryFields.map((field, index) => {
                const hasError = Boolean(errors[field.key]);
                return (
                  <div key={field.key} className={index === inquiryFields.length - 1 ? "md:col-span-2" : ""}>
                    <label className="mb-2 block text-sm uppercase tracking-[0.15em] text-white/55">{field.label}</label>
                    {field.key === "start_date" ? (
                      <DatePicker
                        selected={parseSlashDateToDate(formData.start_date)}
                        onChange={(date) => handleChange("start_date", date ? formatDateToSlash(date) : "")}
                        minDate={today}
                        dateFormat="yyyy/MM/dd"
                        calendarClassName="ideal-datepicker"
                        popperClassName="ideal-datepicker-popper"
                        wrapperClassName="w-full"
                        customInput={<CalendarInput hasError={hasError} placeholder={field.placeholder} />}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        min={field.min}
                        value={formData[field.key]}
                        placeholder={field.placeholder}
                        onChange={(event) => handleChange(field.key, event.target.value)}
                        className={`w-full rounded-2xl border bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a35d]/50 ${
                          field.key === "worker_numbers" ? " no-spinner" : ""
                        } ${
                          hasError ? "border-red-500" : "border-white/10"
                        }`}
                      />
                    )}
                    {hasError && <p className="mt-1 text-sm text-red-400">{errors[field.key]}</p>}
                  </div>
                );
              })}

              {submitError && (
                <div className="md:col-span-2">
                  <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {submitError}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-[#c19a6b] px-6 py-3.5 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Sending..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSuccessModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-[#c19a6b]/45 bg-[#121212] p-6 text-white shadow-2xl">
            <h3 className="text-xl font-semibold text-[#f5dfbf]">Inquiry Sent</h3>
            <p className="mt-3 text-white/80">
              {successMessage || "Inquiry sent successfully. We'll contact you shortly."}
            </p>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-6 w-full rounded-xl bg-[#c19a6b] px-4 py-2.5 font-medium text-black transition hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {isRateLimitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeRateLimitModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-[#c19a6b]/45 bg-[#121212] p-6 text-white shadow-2xl">
            <h3 className="text-xl font-semibold text-[#f5dfbf]">Request Limit Reached</h3>
            <p className="mt-3 text-white/80">
              {rateLimitMessage || "You've sent requests too quickly. Please wait a moment and try again."}
            </p>
            <button
              type="button"
              onClick={closeRateLimitModal}
              className="mt-6 w-full rounded-xl bg-[#c19a6b] px-4 py-2.5 font-medium text-black transition hover:opacity-90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
