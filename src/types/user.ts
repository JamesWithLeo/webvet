import { role, userGender, users } from "@/db/schema/users";

export type Role = (typeof role.enumValues)[number];

export type UserGender = (typeof userGender.enumValues)[number];

export const userGenderValue = userGender.enumValues;

export type UserTypeModel = typeof users.$inferSelect;

export type AdminUserSummary = Pick<
    UserTypeModel,
    | "id"
    | "email"
    | "role"
    | "contactNumber"
    | "firstName"
    | "lastName"
    | "created_at"
>;
