export default async function convertPublicToFile(
    publicPath: string,
    fileName: string
): Promise<File> {
    // 1. Fetch the image from the public folder
    const response = await fetch(publicPath);

    // 2. Convert the response to a Blob (Binary Large Object)
    const blob = await response.blob();

    // 3. Create a new File object from the blob
    // Note: Standard File objects work where FileWithPath is expected
    return new File([blob], fileName, { type: blob.type });
}
