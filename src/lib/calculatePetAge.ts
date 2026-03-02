export default function calculatePetAge(dateOfBirth: Date | string) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months -= 1;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Determine the primary display label
    let displayAge = "";
    if (years > 0) {
        displayAge = `${years} ${years === 1 ? "year" : "years"} old`;
    } else if (months > 0) {
        displayAge = `${months} ${months === 1 ? "month" : "months"} old`;
    } else {
        displayAge = `${days} ${days === 1 ? "day" : "days"} old`;
    }

    return {
        years: years > 0 ? years : null,
        months: months > 0 ? months : null,
        days: days,
        displayAge, // The "Ready to use" string
    };
}
