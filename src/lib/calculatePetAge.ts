export default function calculatePetAge(dateOfBirth: Date | string) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // 1. Adjust for days
    if (days < 0) {
        months -= 1;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // 2. Adjust for months
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // 3. Apply your conditional null logic
    const result = {
        years: years > 0 ? years : null,
        months: years > 0 || months > 0 ? months : null,
        days: days,
    };

    return result;
}
