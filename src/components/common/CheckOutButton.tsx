"use client";

import { useState } from "react";
import { Button } from "@mantine/core";

export default function CheckoutButton() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);

        const res = await fetch("/api/xendit/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "customer@example.com",
                amount: 100000, // Amount in IDR
                description: "Test payment",
            }),
        });

        const data = await res.json();

        if (res.ok && data.invoice_url) {
            window.location.href = data.invoice_url;
        } else {
            console.error("Error creating invoice:", data);
            alert("Failed to create invoice.");
        }

        setLoading(false);
    };

    return (
        <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Redirecting..." : "Pay with Xendit"}
        </Button>
    );
}
