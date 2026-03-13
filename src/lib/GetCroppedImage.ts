interface CropResult {
    file: File;
    fileUrl: string;
}

const GetCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
): Promise<CropResult | null> => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Set canvas size to the exact pixel dimensions provided by the cropper
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Clear canvas to prevent bleeding from previous draws
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], "cropped-image.jpg", {
                    type: "image/jpeg",
                });
                const fileUrl = URL.createObjectURL(blob);
                resolve({ file, fileUrl });
            },
            "image/jpeg",
            1.0 // Use 1.0 for highest quality
        );
    });
};

export default GetCroppedImg;
