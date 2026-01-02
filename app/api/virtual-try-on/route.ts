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
            const garmentRes = await fetch(garmentImageUrl);
            const garmentBlob = await garmentRes.blob();
            const garmentBuffer = Buffer.from(await garmentBlob.arrayBuffer());
            garmentBase64 = garmentBuffer.toString('base64');
            garmentMimeType = garmentBlob.type || 'image/jpeg';
        } else if (garmentImage) {
            const garmentBuffer = Buffer.from(await garmentImage.arrayBuffer());
            garmentBase64 = garmentBuffer.toString('base64');
            garmentMimeType = garmentImage.type || 'image/jpeg';
        }

        const promptText = `TASK: EDIT IMAGE 1 (PERSON) BY WEARING THE CLOTHING FROM IMAGE 2 (GARMENT).
IMAGE 1 DESCRIPTION: A photo of a person.
IMAGE 2 DESCRIPTION: ${productName}.

INSTRUCTIONS:
1. Identify the person in IMAGE 1.
2. Replace their current clothes with the ${productName} shown in IMAGE 2.
3. The ${productName} must be naturally draped over the person's body, matching their pose and proportions.
4. ABSOLUTELY PRESERVE the person's face, hair, skin tone, and body shape from IMAGE 1.
5. ABSOLUTELY PRESERVE the entire background and environment from IMAGE 1.
6. The final output must be a single image of the person from IMAGE 1 wearing the ${productName}.

IMPORTANT: DO NOT return the original image 1. You MUST modify the clothing.`;

        const payload = {
            contents: [{
                parts: [
                    { inline_data: { mime_type: userImage.type || 'image/jpeg', data: userBase64 } },
                    { inline_data: { mime_type: garmentMimeType, data: garmentBase64 } },
                    { text: promptText }
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

        const result = await response.json();

        // Handle specific modality error to give the user better feedback
        if (result.error?.message?.includes('modality')) {
            return NextResponse.json({
                error: "Your Gemini API key does not have 'Image Generation' permissions yet. This is a limited Google preview feature. Please use an account with Image Generation enabled.",
                details: result.error.message
            }, { status: 403 });
        }

        if (!response.ok) {
            return NextResponse.json({ error: result.error?.message || "API Error" }, { status: response.status });
        }

        const part = result?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        const base64Data = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType || 'image/png';

        if (!base64Data) {
            return NextResponse.json({ error: "No image generated" }, { status: 500 });
        }

        return NextResponse.json({
            image: base64Data,
            mimeType: mimeType
        });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
