import { UserTypeModel } from "@/types/user";

export default function isUser(obj: any): obj is UserTypeModel {
    return (
        obj !== null &&
        typeof obj === "object" &&
        typeof obj.id === "string" &&
        (obj.role === "client" ||
            obj.role === "admin" ||
            obj.role === "staff") &&
        obj.created_at instanceof Date &&
        (obj.sex === "MALE" || obj.sex === "FEMALE" || obj.sex === "UNKNOWN") &&
        (obj.email === undefined ||
            obj.email === null ||
            typeof obj.email === "string") &&
        (obj.firstName === null || typeof obj.firstName === "string") &&
        (obj.lastName === null || typeof obj.lastName === "string")
    );
}
