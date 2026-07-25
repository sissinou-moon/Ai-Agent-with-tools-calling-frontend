import type { ApiUser, User } from "./types";

/**
 * Maps the raw API user (with snake_case + password) to a clean
 * frontend-friendly User object.
 */
export function mapUser(raw: ApiUser): User {
    return {
        id: raw.id,
        username: raw.username,
        email: raw.email,
        isActive: raw.is_active,
        isAdmin: raw.is_admin,
        isVerified: raw.is_verified,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    };
}
