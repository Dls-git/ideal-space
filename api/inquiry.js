import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_COMPANY_NAME_LENGTH = 120;
const MAX_CONTACT_PERSON_LENGTH = 120;
const MAX_PHONE_LENGTH = 30;
const MAX_SITE_LOCATION_LENGTH = 200;
const MAX_WORKER_NUMBERS = 10000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const TIME_ZONE = process.env.APP_TIME_ZONE || "Australia/Melbourne";

const globalState = globalThis;
if (!globalState.__inquiryRateLimitMap) {
  globalState.__inquiryRateLimitMap = new Map();
}
const rateLimitMap = globalState.__inquiryRateLimitMap;

function hasNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeHeaderValue(value, fallback = "Customer", maxLength = 80) {
  if (!hasNonEmptyString(value)) return fallback;
  const cleaned = Array.from(String(value), (char) => {
    const code = char.charCodeAt(0);
    if (code < 32 || code === 127) return " ";
    return char;
  }).join("");

  return cleaned
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function getSafeReplyTo(value) {
  if (!hasNonEmptyString(value)) return undefined;
  const normalized = String(value).trim();
  if (normalized.length > MAX_EMAIL_LENGTH) return undefined;
  return EMAIL_REGEX.test(normalized) ? normalized : undefined;
}

function parseDateOnly(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function getTodayInTimeZone(timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const result = new Date(year, month - 1, day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function normalizePayload(rawBody) {
  const body = rawBody && typeof rawBody === "object" ? rawBody : {};
  const errors = [];

  const hasHoneypotField = Object.prototype.hasOwnProperty.call(body, "website_url");
  const honeypotValue = body.website_url;
  const honeypotHasNonEmptyString =
    typeof honeypotValue === "string" && honeypotValue.trim() !== "";
  const honeypotHasUnexpectedType =
    honeypotValue !== undefined && honeypotValue !== null && typeof honeypotValue !== "string";

  if (hasHoneypotField && (honeypotHasNonEmptyString || honeypotHasUnexpectedType)) {
    return { isHoneypot: true, errors, payload: null };
  }

  const company_name = body.company_name;
  const contact_person = body.contact_person;
  const email = body.email;
  const phone = body.phone ?? null;
  const site_location = body.site_location ?? null;
  const worker_numbers = body.worker_numbers;
  const start_date = body.start_date ?? null;

  if (!hasNonEmptyString(company_name)) {
    errors.push("company_name is required and must be a non-empty string.");
  } else if (company_name.trim().length > MAX_COMPANY_NAME_LENGTH) {
    errors.push(`company_name must be ${MAX_COMPANY_NAME_LENGTH} characters or fewer.`);
  }

  if (!hasNonEmptyString(contact_person)) {
    errors.push("contact_person is required and must be a non-empty string.");
  } else if (contact_person.trim().length > MAX_CONTACT_PERSON_LENGTH) {
    errors.push(`contact_person must be ${MAX_CONTACT_PERSON_LENGTH} characters or fewer.`);
  }

  if (!hasNonEmptyString(email)) {
    errors.push("email is required and must be a non-empty string.");
  }
  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  if (normalizedEmail) {
    if (normalizedEmail.length > MAX_EMAIL_LENGTH) {
      errors.push(`email must be ${MAX_EMAIL_LENGTH} characters or fewer.`);
    } else if (!EMAIL_REGEX.test(normalizedEmail)) {
      errors.push("email must be a valid email address.");
    }
  }

  const normalizedWorkerNumbers =
    worker_numbers === undefined || worker_numbers === null || worker_numbers === ""
      ? 2
      : Number(worker_numbers);

  if (!Number.isSafeInteger(normalizedWorkerNumbers)) {
    errors.push("worker_numbers must be an integer.");
  } else if (normalizedWorkerNumbers < 2) {
    errors.push("worker_numbers must be at least 2.");
  } else if (normalizedWorkerNumbers > MAX_WORKER_NUMBERS) {
    errors.push(`worker_numbers must be ${MAX_WORKER_NUMBERS} or fewer.`);
  }

  let normalizedStartDate = null;
  if (start_date !== null && start_date !== undefined && String(start_date).trim() !== "") {
    const parsedStartDate = parseDateOnly(start_date);
    if (!parsedStartDate) {
      errors.push("start_date must be a valid date in YYYY-MM-DD format.");
    } else {
      const today = getTodayInTimeZone(TIME_ZONE);
      if (parsedStartDate < today) {
        errors.push("start_date cannot be earlier than today.");
      } else {
        normalizedStartDate = String(start_date).trim();
      }
    }
  }

  if (phone !== null && phone !== undefined) {
    if (typeof phone !== "string") {
      errors.push("phone must be a string when provided.");
    } else if (phone.trim().length > MAX_PHONE_LENGTH) {
      errors.push(`phone must be ${MAX_PHONE_LENGTH} characters or fewer.`);
    }
  }

  if (site_location !== null && site_location !== undefined) {
    if (typeof site_location !== "string") {
      errors.push("site_location must be a string when provided.");
    } else if (site_location.trim().length > MAX_SITE_LOCATION_LENGTH) {
      errors.push(`site_location must be ${MAX_SITE_LOCATION_LENGTH} characters or fewer.`);
    }
  }

  if (errors.length > 0) {
    return { isHoneypot: false, errors, payload: null };
  }

  return {
    isHoneypot: false,
    errors,
    payload: {
      company_name: String(company_name).trim(),
      contact_person: String(contact_person).trim(),
      email: normalizedEmail,
      phone: phone === null || phone === undefined || String(phone).trim() === "" ? null : String(phone).trim(),
      site_location:
        site_location === null || site_location === undefined || String(site_location).trim() === ""
          ? null
          : String(site_location).trim(),
      worker_numbers: normalizedWorkerNumbers,
      start_date: normalizedStartDate
    }
  };
}

function getClientIp(req) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor.trim() !== "") {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers["x-real-ip"];
  if (typeof xRealIp === "string" && xRealIp.trim() !== "") {
    return xRealIp.trim();
  }
  return "unknown";
}

function getRateLimitStatus(clientIp, now) {
  const entries = rateLimitMap.get(clientIp) || [];
  const recentEntries = entries.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recentEntries.length >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - recentEntries[0])) / 1000)
    );
    rateLimitMap.set(clientIp, recentEntries);
    return { limited: true, retryAfterSeconds };
  }
  recentEntries.push(now);
  rateLimitMap.set(clientIp, recentEntries);
  return { limited: false, retryAfterSeconds: 0 };
}

function buildInquiryRows(payload) {
  return [
    ["Company Name", payload.company_name],
    ["Contact Person", payload.contact_person],
    ["Email", payload.email],
    ["Phone", payload.phone || "-"],
    ["Site Location", payload.site_location || "-"],
    ["Worker Numbers", String(payload.worker_numbers)],
    ["Start Date", payload.start_date || "-"]
  ];
}

function buildInquiryEmailHtml(payload) {
  const rows = buildInquiryRows(payload)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#111827;width:220px;">${escapeHtml(
            label
          )}</td>
          <td style="padding:12px 14px;border:1px solid #e5e7eb;color:#1f2937;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="margin:0;padding:28px;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;color:#111827;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
        <div style="padding:24px 28px;background:linear-gradient(135deg,#111827 0%,#1f2937 100%);">
          <h2 style="margin:0 0 8px;font-size:22px;color:#ffffff;">New Website Inquiry</h2>
          <p style="margin:0;font-size:14px;color:#d1d5db;">Ideal Space Solutions inquiry notification</p>
        </div>
        <div style="padding:24px 28px;">
          <p style="margin:0 0 18px;font-size:14px;color:#374151;">
            A new inquiry has been submitted from the official website. Please review the details below.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildInquiryEmailText(payload) {
  const lines = buildInquiryRows(payload).map(([label, value]) => `${label}: ${value}`);
  return [
    "New Website Inquiry - Ideal Space Solutions",
    "",
    "A new inquiry has been submitted from the website.",
    "",
    ...lines
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed."
    });
  }

  const clientIp = getClientIp(req);
  const now = Date.now();
  const rateLimitStatus = getRateLimitStatus(clientIp, now);
  if (rateLimitStatus.limited) {
    res.setHeader("Retry-After", String(rateLimitStatus.retryAfterSeconds));
    return res.status(429).json({
      success: false,
      message: "Too many inquiries sent from this IP, please try again after a minute."
    });
  }

  const { isHoneypot, errors, payload } = normalizePayload(req.body);
  if (isHoneypot) {
    return res.status(200).json({
      success: true,
      message: "Inquiry submitted successfully."
    });
  }
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!hasNonEmptyString(resendApiKey) || !hasNonEmptyString(resendFromEmail) || !hasNonEmptyString(adminEmail)) {
    return res.status(500).json({
      success: false,
      message: "Inquiry service is not configured."
    });
  }

  try {
    const resend = new Resend(resendApiKey.trim());
    const safeContactPerson = sanitizeHeaderValue(payload.contact_person, "Customer", 80);
    const safeReplyTo = getSafeReplyTo(payload.email);

    const { error } = await resend.emails.send({
      from: resendFromEmail.trim(),
      to: [adminEmail.trim()],
      subject: `New Inquiry from ${safeContactPerson} - Ideal Space Website`,
      html: buildInquiryEmailHtml(payload),
      text: buildInquiryEmailText(payload),
      replyTo: safeReplyTo
    });

    if (error) {
      return res.status(502).json({
        success: false,
        message: "Email delivery failed. Please try again later."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully."
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}
