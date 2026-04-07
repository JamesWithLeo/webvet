"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client after the first render
    useEffect(() => {
        setMounted(true);
    }, []);

    // On the server or first render, we return a plain fragment.
    // This skips the <script> injection until the client is ready.
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <NextThemes attribute="class" enableSystem={true} defaultTheme="light">
            {children}
        </NextThemes>
    );
}
