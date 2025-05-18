export function extractErrorMessage(html) {
    const match = html.match(/Error:\s*([^\n<]+)/);
    return match ? match[1].trim() : "Something went wrong!";
}


export default function getCroppedImg(imageSrc, crop, zoom = 1) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        };
        image.onerror = reject;
    });
}


export function getDate(strDate) {
    const date = new Date(strDate);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' };
    const timeString = date.toLocaleString('en-US', options);
    return timeString
}