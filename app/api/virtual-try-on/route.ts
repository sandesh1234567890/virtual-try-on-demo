import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const userImage = formData.get('userImage') as Blob;
        const garmentImage = formData.get('garmentImage') as Blob | null;
        const garmentImageUrl = formData.get('garmentImageUrl') as string | null;
        const productName = formData.get('productName') as string;

        if (!userImage) {
            return NextResponse.json({ error: "Missing user image" }, { status: 400 });
        }

        if (!garmentImage && !garmentImageUrl) {
            return NextResponse.json({ error: "Missing garment image (file or URL)" }, { status: 400 });
        }

        // Convert User Image to Base64
        const userBuffer = Buffer.from(await userImage.arrayBuffer());
        const userBase64 = userBuffer.toString('base64');

        // Handle Garment Image (File vs URL)
        let garmentBase64 = '';
        let garmentMimeType = '';

        if (garmentImageUrl) {
            // Fetch from URL
            console.log(`Fetching garment from URL: ${garmentImageUrl}`);
            const garmentRes = await fetch(garmentImageUrl);
            if (!garmentRes.ok) throw new Error(`Failed to fetch garment URL: ${garmentRes.statusText}`);
            const garmentBlob = await garmentRes.blob();
            const garmentBuffer = Buffer.from(await garmentBlob.arrayBuffer());
            garmentBase64 = garmentBuffer.toString('base64');
            garmentMimeType = garmentBlob.type || 'image/jpeg';
        } else if (garmentImage) {
            // Use Uploaded File
            const garmentBuffer = Buffer.from(await garmentImage.arrayBuffer());
            garmentBase64 = garmentBuffer.toString('base64');
            garmentMimeType = garmentImage.type || 'image/jpeg';
        }

        const promptText = `You are an expert at photo editing. Your task is to perform a virtual try-on. Take the person from the first image and realistically place the garment, which is a '${productName}', from the second image onto their torso. The garment should fit their body shape and pose naturally. Preserve the original background, the person's head, arms, and legs. Output only the final, edited image.`;

        const payload = {
            contents: [{
                parts: [
                    { text: promptText },
                    {
                        inline_data: {
                            mime_type: userImage.type || 'image/jpeg',
                            data: userBase64
                        }
                    },
                    {
                        inline_data: {
                            mime_type: garmentMimeType,
                            data: garmentBase64
                        }
                    }
                ]
            }],
            generationConfig: {
                responseModalities: ['IMAGE']
            }
        };

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json({ error: errorData.error?.message || "API Error" }, { status: response.status });
        }

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        const base64Data = part?.inlineData?.data;

        if (!base64Data) {
            return NextResponse.json({ error: "No image generated" }, { status: 500 });
        }

        return NextResponse.json({ image: base64Data });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
