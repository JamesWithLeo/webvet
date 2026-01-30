import z4 from "zod/v4";

const dayStringEnum = z4.enum(["0", "1", "2", "3", "4", "5", "6"]);

const stringToNumberArray = z4
    .array(dayStringEnum)
    .min(1, { message: "Please select at least one day" })
    .transform((val) => val.map((day) => parseInt(day, 10)));

export const updateServiceScheduleSchema = z4.object({
    GROOMING: stringToNumberArray,
    VACCINATION: stringToNumberArray,
    CHECK_UP: stringToNumberArray,
    DEWORMING: stringToNumberArray,
});

export type ServiceScheduleInput = z4.input<typeof updateServiceScheduleSchema>;
