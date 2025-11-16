// theme/mantine-client-config.tsx
"use client";

import { createTheme, MantineColorsTuple, MantineTheme } from "@mantine/core";

const myColor: MantineColorsTuple = [
    "#edf7fc",
    "#dbecf5",
    "#b2d9ec",
    "#87c4e4",
    "#66b3dd",
    "#52a8d9",
    "#47a3d8",
    "#398ec0",
    "#2d7fac",
    "#14678f",
];

export const theme = createTheme({
    colors: {
        primary: myColor,
    },
    primaryColor: "primary",

    // primaryShade: {
    //     light: 9,
    //     dark: 5,
    // },
});
