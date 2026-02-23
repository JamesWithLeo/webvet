export const translateDatabaseError = (
    code: string,
    constraint?: string
): string => {
    // 1. Fallback for the substring error
    // If code is undefined, it's not a standard Postgres error we can map
    if (!code) {
        return "Something went wrong while saving. Please try again.";
    }

    // 2. High-Priority: Specific Business Logic (Matches your log!)
    if (constraint === "unique_pet_service_per_appointment") {
        return "This pet is already scheduled for this service in this appointment.";
    }

    // Use the "Class" (first two characters) for broad categories
    const errorClass = code.substring(0, 2);

    const errorMap: Record<string, string> = {
        // Class 23 — Integrity Constraints (User Input Errors)
        "23505": "Duplicate entry found. This record already exists.",
        "23503":
            "Cannot delete or change this because it is being used elsewhere.",
        "23502": "Some required information is missing.",
        "23514":
            "The information provided doesn't meet the requirements (Check violation).",

        // Class 22 — Data Exceptions (Formatting Errors)
        "22P02": "Invalid data format. Please check your numbers or text.",
        "22007": "The date or time format is not recognized.",
        "22003": "The number you entered is too large.",
        "22012": "Mathematical error: Division by zero.",

        // Class 28/42 — Permissions
        "28P01":
            "Database authentication failed. Please check server credentials.",
        "42501":
            "You do not have the necessary permissions to perform this action.",

        // Class 08 — Connection Issues
        "08003": "The database connection is lost.",
        "08006": "Database connection failure.",
    };

    // 1. High-Priority: Specific Business Logic (Constraint Names)
    if (constraint === "unique_pet_service_per_appointment") {
        return "This pet is already scheduled for this service in this appointment.";
    }

    // 2. Medium-Priority: Specific Error Codes
    if (errorMap[code]) return errorMap[code];

    // 3. Low-Priority: Categorical Fallbacks (If specific code isn't mapped)
    switch (errorClass) {
        case "23":
            return "A database rule was violated (Duplicate or missing link).";
        case "22":
            return "There is an issue with how the data is formatted.";
        case "08":
            return "The system is having trouble connecting to the database.";
        case "53":
        case "54":
            return "The server is currently overloaded. Please try again later.";
        default:
            return "Something went wrong on our end. Please try again.";
    }
};

export default translateDatabaseError;
