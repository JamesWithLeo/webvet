export const config = {
    matcher: [
        /*
         * Exclude the webhook from all middleware logic.
         * This prevents the 303/308 redirect that turns POST into GET.
         */
        "/((?!api/webhooks/xendit|_next/static|_next/image|favicon.ico).*)",
    ],
};
