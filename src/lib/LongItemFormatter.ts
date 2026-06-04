export default function LongItemFormatter(item: Iterable<string>) {
    const formatter = new Intl.ListFormat("en", {
        style: "long",
        type: "conjunction",
    });
    return formatter.format([...new Set(item)]);
}
