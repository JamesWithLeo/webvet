"use server";
import { UTApi } from "uploadthing/server";

export const DeleteUTFile = async (photoUrlKey: string | string[]) => {
    const utapi = new UTApi();
    try {
        const deletionResult = await utapi.deleteFiles(photoUrlKey);
        if (!deletionResult.success) {
            console.error(
                `CLEANUP_FAILURE: Manual deletion required for key [${photoUrlKey}]`
            );
        }
        if (deletionResult.success) {
            console.log(`✅ Successfully deleted from storage: ${photoUrlKey}`);
            return { success: true };
        } else {
            console.error(`❌ UploadThing could not delete: ${photoUrlKey}`);
            return {
                success: false,
                error: "UploadThing deletion unsuccessful",
            };
        }
    } catch (error) {
        console.error("🔥 Critical error during storage cleanup:", error);
        return { success: false };
    }
};
