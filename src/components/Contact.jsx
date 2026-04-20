import { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const INQUIRY_API_URL = "/api/inquiry";
const AU_TIME_ZONE = (import.meta.env.VITE_APP_TIME_ZONE || "Australia/Melbourne").trim();

const initialFormData = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  site_location: "",
  worker_numbers: "2",
  start_date: "",
  website_url: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneAllowedRegex = /^[\d\s()+-]+$/;
const apiDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
const START_DATE_PLACEHOLDER = "dd-MM-yyyy";
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_NAME_LENGTH = 120;
const MAX_CONTACT_PERSON_LENGTH = 120;
const MAX_PHONE_LENGTH = 30;
const MAX_SITE_LOCATION_LENGTH = 200;
const MAX_WORKER_NUMBERS = 10000;
const REQUEST_TIMEOUT_MS = 15000;
const knownFieldKeys = new Set([
  "company_name",
  "contact_person",
  "email",
  "phone",
  "site_location",
  "worker_numbers",
  "start_date",
]);

const formatDateToSlash = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const parseSlashDateToDate = (value) => {
  if (!value) return null;
  const match = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(String(value).trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
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

const formatDateToApi = (value) => {
  const parsedDate = parseSlashDateToDate(value);
  if (!parsedDate) return "";
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayApiDateInTimeZone = (timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
};

const parseApiDateOnly = (value) => {
  if (!value || typeof value !== "string") return null;
  const match = apiDateRegex.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const validatePayloadForApi = (payload) => {
  const nextErrors = {};
  const todayApiDate = getTodayApiDateInTimeZone(AU_TIME_ZONE);

  if (!payload.company_name || typeof payload.company_name !== "string" || !payload.company_name.trim()) {
    nextErrors.company_name = "company_name is required and must be a non-empty string.";
  } else if (payload.company_name.trim().length > MAX_COMPANY_NAME_LENGTH) {
    nextErrors.company_name = `company_name must be ${MAX_COMPANY_NAME_LENGTH} characters or fewer.`;
  }

  if (!payload.contact_person || typeof payload.contact_person !== "string" || !payload.contact_person.trim()) {
    nextErrors.contact_person = "contact_person is required and must be a non-empty string.";
  } else if (payload.contact_person.trim().length > MAX_CONTACT_PERSON_LENGTH) {
    nextErrors.contact_person = `contact_person must be ${MAX_CONTACT_PERSON_LENGTH} characters or fewer.`;
  }

  if (!payload.email || typeof payload.email !== "string" || !payload.email.trim()) {
    nextErrors.email = "email is required and must be a non-empty string.";
  } else if (payload.email.length > MAX_EMAIL_LENGTH) {
    nextErrors.email = `email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
  } else if (!emailRegex.test(payload.email)) {
    nextErrors.email = "email must be a valid email address.";
  }

  if (payload.phone !== "" && (typeof payload.phone !== "string" || payload.phone.length > MAX_PHONE_LENGTH)) {
    nextErrors.phone = `phone must be ${MAX_PHONE_LENGTH} characters or fewer.`;
  }

  if (
    payload.site_location !== "" &&
    (typeof payload.site_location !== "string" || payload.site_location.length > MAX_SITE_LOCATION_LENGTH)
  ) {
    nextErrors.site_location = `site_location must be ${MAX_SITE_LOCATION_LENGTH} characters or fewer.`;
  }

  if (!Number.isSafeInteger(payload.worker_numbers)) {
    nextErrors.worker_numbers = "worker_numbers must be an integer.";
  } else if (payload.worker_numbers < 2) {
    nextErrors.worker_numbers = "worker_numbers must be at least 2.";
  } else if (payload.worker_numbers > MAX_WORKER_NUMBERS) {
    nextErrors.worker_numbers = `worker_numbers must be ${MAX_WORKER_NUMBERS} or fewer.`;
  }

  if (payload.start_date) {
    const parsedDate = parseApiDateOnly(payload.start_date);
    if (!parsedDate) {
      nextErrors.start_date = "start_date must be a valid date in YYYY-MM-DD format.";
    } else if (payload.start_date < todayApiDate) {
      nextErrors.start_date = "start_date cannot be earlier than today.";
    }
  }

  return nextErrors;
};

const inferFieldKeyFromMessage = (message) => {
  if (!message || typeof message !== "string") return "";
  const normalized = message.trim().toLowerCase();
  const match = /^([a-z_]+)\s/.exec(normalized);
  if (!match) return "";
  return knownFieldKeys.has(match[1]) ? match[1] : "";
};

const normalizeApiText = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(" ");
  }
  return "";
};

const mergeErrorWithDetails = (baseMessage, details) => {
  if (!details) return baseMessage;
  const normalizedBase = baseMessage.trim().toLowerCase();
  const normalizedDetails = details.trim().toLowerCase();
  if (normalizedDetails === normalizedBase || normalizedDetails.startsWith(`${normalizedBase} `)) {
    return details;
  }
  return `${baseMessage} Details: ${details}`;
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
        addMessage(item, inferFieldKeyFromMessage(item));
        return;
      }
      if (!item || typeof item !== "object") return;

      const fieldKeyFromProperty = typeof item.property === "string" ? item.property : "";
      const fieldKey = fieldKeyFromProperty || inferFieldKeyFromMessage(item.message);
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
    {
      key: "company_name",
      label: "Company Name",
      type: "text",
      placeholder: "Your company name",
      maxLength: MAX_COMPANY_NAME_LENGTH,
    },
    {
      key: "contact_person",
      label: "Contact Person",
      type: "text",
      placeholder: "Full name",
      maxLength: MAX_CONTACT_PERSON_LENGTH,
    },
    { key: "phone", label: "Phone", type: "tel", placeholder: "Best contact number", maxLength: MAX_PHONE_LENGTH },
    { key: "email", label: "Email", type: "email", placeholder: "Work email", maxLength: MAX_EMAIL_LENGTH },
    {
      key: "site_location",
      label: "Site Location",
      type: "text",
      placeholder: "Project address or suburb",
      maxLength: MAX_SITE_LOCATION_LENGTH,
    },
    {
      key: "worker_numbers",
      label: "Number of Workers Required",
      type: "number",
      placeholder: "e.g. 2",
      min: 2,
      max: MAX_WORKER_NUMBERS,
      step: 1,
    },
    { key: "start_date", label: "Start Date", type: "text", placeholder: START_DATE_PLACEHOLDER },
  ];

  const sectionTitle = "text-xs uppercase tracking-[0.28em] text-[#c9a35d] sm:text-sm sm:tracking-[0.3em]";
  const todayApiDate = getTodayApiDateInTimeZone(AU_TIME_ZONE);
  const today = parseApiDateOnly(todayApiDate) || new Date(new Date().setHours(0, 0, 0, 0));
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
    } else if (formData.company_name.trim().length > MAX_COMPANY_NAME_LENGTH) {
      nextErrors.company_name = `Company name must be ${MAX_COMPANY_NAME_LENGTH} characters or fewer.`;
    }
    if (!formData.contact_person.trim()) {
      nextErrors.contact_person = "Contact person is required.";
    } else if (formData.contact_person.trim().length > MAX_CONTACT_PERSON_LENGTH) {
      nextErrors.contact_person = `Contact person must be ${MAX_CONTACT_PERSON_LENGTH} characters or fewer.`;
    }
    if (formData.phone.trim()) {
      if (/[a-zA-Z]/.test(formData.phone)) {
        nextErrors.phone = "Phone number cannot contain English letters.";
      } else if (!phoneAllowedRegex.test(formData.phone)) {
        nextErrors.phone = "Please enter a valid phone number.";
      } else if (formData.phone.trim().length > MAX_PHONE_LENGTH) {
        nextErrors.phone = `Phone number must be ${MAX_PHONE_LENGTH} characters or fewer.`;
      }
    }
    const normalizedEmail = formData.email.trim();
    if (!normalizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (normalizedEmail.length > MAX_EMAIL_LENGTH) {
      nextErrors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
    } else if (!emailRegex.test(normalizedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (formData.site_location.trim().length > MAX_SITE_LOCATION_LENGTH) {
      nextErrors.site_location = `Site location must be ${MAX_SITE_LOCATION_LENGTH} characters or fewer.`;
    }

    const workerCount = Number(formData.worker_numbers);
    if (!Number.isSafeInteger(workerCount)) {
      nextErrors.worker_numbers = "Worker numbers must be an integer.";
    } else if (workerCount < 2) {
      nextErrors.worker_numbers = "Worker numbers must be at least 2.";
    } else if (workerCount > MAX_WORKER_NUMBERS) {
      nextErrors.worker_numbers = `Worker numbers must be ${MAX_WORKER_NUMBERS} or fewer.`;
    }
    if (formData.start_date) {
      const startDateApi = formatDateToApi(formData.start_date);
      if (!startDateApi) {
        nextErrors.start_date = "Please select a valid date.";
      } else if (startDateApi < todayApiDate) {
        nextErrors.start_date = "Start date cannot be earlier than today.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setSubmitError("");
    setSuccessMessage("");
    setRateLimitMessage("");
    setIsRateLimitModalOpen(false);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const payload = {
      company_name: formData.company_name.trim(),
      contact_person: formData.contact_person.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      site_location: formData.site_location.trim(),
      worker_numbers: Number(formData.worker_numbers),
      start_date: formData.start_date ? formatDateToApi(formData.start_date) : "",
      website_url: formData.website_url,
    };

    const apiMirrorValidationErrors = validatePayloadForApi(payload);
    if (Object.keys(apiMirrorValidationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...apiMirrorValidationErrors }));
      setSubmitError("Validation failed. Please check the highlighted fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(INQUIRY_API_URL, payload, {
        timeout: REQUEST_TIMEOUT_MS,
      });
      const contentType = String(response.headers?.["content-type"] || "").toLowerCase();
      const isJsonResponse = contentType.includes("application/json");
      const isApiSuccess = response.status === 201 && response.data?.success === true;
      if (!isJsonResponse || !isApiSuccess) {
        throw new Error("Unexpected response payload from inquiry endpoint.");
      }
      setFormData(initialFormData);
      setErrors({});
      setSuccessMessage(response.data?.message || "Inquiry sent successfully. We'll contact you shortly.");
      setIsSuccessModalOpen(true);
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = normalizeApiText(error.response?.data?.message);
      const apiError = normalizeApiText(error.response?.data?.error);
      const backendDetails = [apiMessage, apiError].filter(Boolean).join(" ").trim();
      const apiValidationErrors = error.response?.data?.errors;
      const retryAfterHeader = error.response?.headers?.["retry-after"];
      const isTimeout = error.code === "ECONNABORTED";
      const { fieldErrors, validationMessage } = extractApiValidation(apiValidationErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      const combinedErrorText = `${apiMessage || ""} ${apiError || ""}`.toLowerCase();
      const isRateLimited =
        status === 429 ||
          combinedErrorText.includes("rate limit") ||
          combinedErrorText.includes("too many requests");
      const retryAfterText =
        retryAfterHeader && Number.isFinite(Number(retryAfterHeader))
          ? ` Please try again in ${retryAfterHeader} seconds.`
          : "";

      if (isRateLimited) {
        setSubmitError("");
        setRateLimitMessage(
          backendDetails || `You've sent requests too quickly.${retryAfterText || " Please wait a moment and try again."}`
        );
        setIsRateLimitModalOpen(true);
      } else if (status === 400 || status === 422) {
        const validationFallback = "Validation failed. Please check the highlighted fields.";
        setSubmitError(validationMessage || mergeErrorWithDetails(validationFallback, backendDetails));
      } else if (status === 401) {
        setSubmitError(mergeErrorWithDetails("Unauthorized request. Please refresh the page and try again.", backendDetails));
      } else if (status === 403) {
        setSubmitError(mergeErrorWithDetails("Access denied for this request.", backendDetails));
      } else if (status === 404) {
        setSubmitError(mergeErrorWithDetails("Inquiry service is unavailable (404). Please try again later.", backendDetails));
      } else if (status === 408) {
        setSubmitError(mergeErrorWithDetails("Request timed out. Please try again.", backendDetails));
      } else if (status === 413) {
        setSubmitError(mergeErrorWithDetails("Request payload is too large. Please shorten the input and try again.", backendDetails));
      } else if (status === 415) {
        setSubmitError(mergeErrorWithDetails("Unsupported request format. Please refresh the page and try again.", backendDetails));
      } else if (status >= 500) {
        setSubmitError(mergeErrorWithDetails("Server error occurred while submitting your inquiry. Please try again later.", backendDetails));
      } else if (status) {
        setSubmitError(mergeErrorWithDetails("Unable to submit your inquiry right now. Please try again.", backendDetails));
      } else if (isTimeout) {
        setSubmitError("Request timed out. Please check your network and try again.");
      } else {
        setSubmitError(mergeErrorWithDetails("Network error. Please check your connection and try again.", backendDetails));
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
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              Need reliable plaster manpower for your next project?
            </h1>
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

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact_reference_code">Reference</label>
                <input
                  id="contact_reference_code"
                  type="text"
                  name="contact_reference_code"
                  value={formData.website_url}
                  onChange={(event) => handleChange("website_url", event.target.value)}
                  tabIndex={-1}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </div>
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
                        dateFormat="dd-MM-yyyy"
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
                        max={field.max}
                        step={field.step}
                        maxLength={field.maxLength}
                        value={formData[field.key]}
                        placeholder={field.placeholder}
                        onInvalid={(event) => event.preventDefault()}
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
