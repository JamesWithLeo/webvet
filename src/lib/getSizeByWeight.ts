export const getSizeByWeight = (weightKg: number) => {
    if (weightKg < 10) return "SMALL";
    if (weightKg <= 25) return "MEDIUM";
    return "LARGE";
};
