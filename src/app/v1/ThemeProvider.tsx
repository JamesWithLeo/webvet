"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemes } from "next-themes";

export default function ThemeProvider({ children }: { children: ReactNode }) {
    return <NextThemes attribute={"class"}>{children}</NextThemes>;
}
