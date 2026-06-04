"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

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
    "#043343",
];

export const theme = createTheme({
    colors: {
        primary: myColor,
    },
    primaryColor: "primary",

    breakpoints: {
        xs: "30rem",
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        xxl: "96rem",
    },
    // primaryShade: {
    //     light: 9,
    //     dark: 5,
    // },
});
