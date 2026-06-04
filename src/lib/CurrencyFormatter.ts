export default function CurrencyFormatter(value: any) {
    const currencyFormatter = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });
    return currencyFormatter.format(Number(value));
}
