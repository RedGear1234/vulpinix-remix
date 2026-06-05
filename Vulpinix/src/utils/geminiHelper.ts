import { API_BASE } from '../config/api';

export interface GeminiCaptionResult {
  caption: string;
  hashtags: string[];
}

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Generate caption via the backend proxy.
 * The backend holds the GEMINI_API_KEY securely.
 * Returns { needsClientKey: true } if the server key is not configured.
 */
const generateCaptionViaBackend = async (
  file: File
): Promise<GeminiCaptionResult & { needsClientKey?: boolean }> => {
  const isImage = !file.type.startsWith('video/');

  const payload: Record<string, any> = {
    isImage,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };

  if (isImage) {
    const base64Data = await fileToBase64(file);
    const base64Content = base64Data.split(',')[1] || base64Data;
    let mimeType = file.type || 'image/jpeg';
    // Remap HEIC/HEIF to JPEG since Gemini doesn't accept them directly
    if (mimeType === 'image/heic' || mimeType === 'image/heif') {
      mimeType = 'image/jpeg';
    }
    payload.imageBase64 = base64Content;
    payload.mimeType = mimeType;
  }

  const response = await fetch(`${API_BASE}/api/social/generate-caption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.ok && data.success) {
    return { caption: data.caption, hashtags: data.hashtags };
  }

  if (data.needsClientKey) {
    // Signal to caller that we need the user's own API key
    return { caption: '', hashtags: [], needsClientKey: true };
  }

  throw new Error(data.error || `Backend error ${response.status}`);
};

/**
 * Direct Gemini API call — only used when the backend key is not configured
 * and the user has provided their own key via Settings.
 * Uses gemini-2.5-flash.
 */
const generateCaptionDirectly = async (
  file: File,
  apiKey: string
): Promise<GeminiCaptionResult> => {
  const isImage = !file.type.startsWith('video/');

  // Use gemini-2.5-flash
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let requestBody: any;

  if (isImage) {
    const base64Data = await fileToBase64(file);
    const base64Content = base64Data.split(',')[1] || base64Data;
    let mimeType = file.type || 'image/jpeg';
    if (mimeType === 'image/heic' || mimeType === 'image/heif') {
      mimeType = 'image/jpeg';
    }

    requestBody = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Content,
            },
          },
          {
            text: `Analyze this image carefully and generate engaging social media content that is specifically relevant to what you see in the image.

Provide:
1. A captivating caption (2-3 sentences) tailored to the actual image content, with appropriate emojis
2. 5-7 relevant hashtags based on what is shown in the image

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your image-specific caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`,
          },
        ],
      }],
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
    };
  } else {
    // Video: use filename as context
    const fileLabel = file.name
      ? `a video named "${file.name}"`
      : `a ${file.type || 'video'} file`;

    requestBody = {
      contents: [{
        parts: [{
          text: `Generate engaging social media content for ${fileLabel}.

Use the filename as context to infer the topic and create relevant, specific content.

Provide:
1. A captivating caption (2-3 sentences) with emojis, relevant to the video topic
2. 5-7 relevant hashtags based on the likely content

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your context-aware caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`,
        }],
      }],
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
    };
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini Direct API Error:', errorData);
    throw new Error(
      errorData?.error?.message || `Gemini API error ${response.status}`
    );
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!generatedText) {
    throw new Error('No content generated from Gemini');
  }

  return parseGeminiText(generatedText);
};

/** Parses the raw Gemini text response into caption + hashtags */
function parseGeminiText(generatedText: string): GeminiCaptionResult {
  try {
    let cleanedText = generatedText.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.caption && parsed.hashtags) {
        return { caption: parsed.caption, hashtags: parsed.hashtags };
      }
    }
    throw new Error('No valid JSON found');
  } catch {
    // Manual extraction fallback
    const captionMatch = generatedText.match(/"caption"\s*:\s*"([^"]*)"/);
    const hashtagsMatch = generatedText.match(/"hashtags"\s*:\s*\[(.*?)\]/s);

    const caption = captionMatch?.[1] || generatedText.slice(0, 200);
    let hashtags = ['#DigitalMarketing', '#AI', '#Marketing', '#ContentCreation', '#SocialMedia'];

    if (hashtagsMatch) {
      const parsed = hashtagsMatch[1]
        .split(',')
        .map((h: string) => h.trim().replace(/["\s]/g, ''))
        .filter((h: string) => h.startsWith('#'));
      if (parsed.length > 0) hashtags = parsed;
    }

    return { caption, hashtags };
  }
}

/**
 * Main export: generates a caption for the uploaded file.
 * 1. Tries the secure backend endpoint (/api/social/generate-caption)
 * 2. Falls back to a direct Gemini API call if the server key is missing
 *    and the user has configured their own key (passed via `clientApiKey`)
 */
export const generateCaptionWithGemini = async (
  file: File,
  clientApiKey?: string
): Promise<GeminiCaptionResult> => {
  let backendError: Error | null = null;

  // Step 1: Try backend
  try {
    const backendResult = await generateCaptionViaBackend(file);

    if (!backendResult.needsClientKey) {
      return { caption: backendResult.caption, hashtags: backendResult.hashtags };
    }
  } catch (err: any) {
    backendError = err;
    console.warn('[Gemini] Backend call failed:', err.message);
  }

  // Step 2: Check if client fallback key is configured
  const hasClientKey = clientApiKey && clientApiKey !== 'YOUR_GEMINI_API_KEY_HERE';

  if (!hasClientKey) {
    // If backend gave a real API error, propagate it so the user sees the real cause (e.g. quota limit)
    if (backendError) {
      throw backendError;
    }
    // Otherwise, it was just a missing server key
    throw new Error(
      'No Gemini API key available. Add GEMINI_API_KEY to the backend .env or configure your key in Settings.'
    );
  }

  // Step 3: Fall back to direct API with client key
  console.info('[Gemini] Trying direct API with client key…');
  return generateCaptionDirectly(file, clientApiKey);
};
