import { GraduationCap, School } from "lucide-react";

export const USER_ROLES = {
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "admin",
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.STUDENT,
        label: "Student",
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.TEACHER,
        label: "Teacher",
        icon: School,
    },
];

export const DEPARTMENTS = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Economics",
    "Business Administration",
    "Engineering",
    "Psychology",
    "Sociology",
    "Political Science",
    "Philosophy",
    "Education",
    "Fine Arts",
    "Music",
    "Physical Education",
    "Law",
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

// Env validation helpers
const requireNonEmpty = (name: string, value: unknown): string => {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`[ENV] ${name} is missing or empty. Check your .env or build-time environment.`);
    }
    return value.trim();
};

const requireUrl = (name: string, value: unknown): string => {
    const str = requireNonEmpty(name, value);
    try {
        const normalized = new URL(str).toString().replace(/\/+$/, "");
        return normalized;
    } catch {
        throw new Error(`[ENV] ${name} must be a valid URL. Received: ${str}`);
    }
};

export const CLOUDINARY_UPLOAD_URL = requireUrl(
    "VITE_CLOUDINARY_UPLOAD_URL",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
);
export const CLOUDINARY_CLOUD_NAME = requireNonEmpty(
    "VITE_CLOUDINARY_CLOUD_NAME",
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
);
export const BACKEND_BASE_URL = requireUrl(
    "VITE_BACKEND_BASE_URL",
    import.meta.env.VITE_BACKEND_BASE_URL,
);

export const BASE_URL = requireUrl(
    "VITE_API_URL",
    import.meta.env.VITE_API_URL,
);
export const ACCESS_TOKEN_KEY = requireNonEmpty(
    "VITE_ACCESS_TOKEN_KEY",
    import.meta.env.VITE_ACCESS_TOKEN_KEY,
);
export const REFRESH_TOKEN_KEY = requireNonEmpty(
    "VITE_REFRESH_TOKEN_KEY",
    import.meta.env.VITE_REFRESH_TOKEN_KEY,
);

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const CLOUDINARY_UPLOAD_PRESET = requireNonEmpty(
    "VITE_CLOUDINARY_UPLOAD_PRESET",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
);