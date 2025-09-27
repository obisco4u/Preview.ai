import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

/**
 * Extracts a video title from user input. If the input is a YouTube URL,
 * it uses AI to get the title. Otherwise, it assumes the input is the title.
 * @param urlOrTitle - The user's input string.
 * @returns The video title.
 */
export const getVideoTitle = async (urlOrTitle: string): Promise<string> => {
  if (!YOUTUBE_URL_REGEX.test(urlOrTitle)) {
    return urlOrTitle;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract the video title from the following YouTube URL: ${urlOrTitle}. Respond with only the title text.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error extracting video title:", error);
    throw new Error("Could not extract title from YouTube URL. Please enter the title manually.");
  }
};

/**
 * Generates multiple base thumbnail image variations using ImageGen.
 * @param title - The video title to base the images on.
 * @returns An array of base64 encoded strings of the generated JPEG images.
 */
export const generateThumbnailImage = async (title: string): Promise<string[]> => {
  try {
    const prompt = `A compelling, high-resolution YouTube thumbnail for a video titled "${title}". The image should be visually stunning, with vibrant colors, high contrast, and a clear focal point that captures the essence of the video. It should be emotionally engaging and designed to maximize click-through rate. Do NOT include any text in the image.`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Image generation failed, no images were returned.");
    }
    return response.generatedImages.map(img => img.image.imageBytes);
  } catch (error) {
    console.error("Error generating base image:", error);
    throw new Error("Failed to generate the base thumbnail image.");
  }
};

/**
 * Adds a title overlay and an optional user image to a base image using Nano Banana.
 * @param base64Image - The base64 encoded JPEG image.
 * @param title - The text to overlay on the image.
 * @param userImage - An optional base64 encoded user image to composite.
 * @returns A base64 encoded string of the final JPEG image.
 */
export const addOverlaysToImage = async (base64Image: string, title: string, userImage: string | null): Promise<string> => {
  try {
    const parts: any[] = [
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      },
    ];

    let promptText = `Overlay the following text onto the image in a visually appealing, bold, and highly readable font suitable for a YouTube thumbnail. Text: "${title}". Make the text stand out with extreme contrast, perhaps using a thick outline, a drop shadow, or placing it within a contrasting background shape. The text should be large, clear, and a primary focus of the thumbnail.`;

    if (userImage) {
      const userImageBase64 = userImage.split(',')[1];
      const userImageMimeType = userImage.match(/:(.*?);/)?.[1] ?? 'image/png';

      parts.push({
        inlineData: {
          data: userImageBase64,
          mimeType: userImageMimeType,
        },
      });

      promptText = `Using the first image as the background, seamlessly composite the subject from the second image into the scene. Then, overlay the text "${title}". The final result should be a professional, high-impact YouTube thumbnail. The text must be bold, large, and highly readable with excellent contrast.`;
    }
    
    parts.push({ text: promptText });
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("Image editing failed, no image was returned in the response.");
  } catch (error) {
    console.error("Error adding overlays to image:", error);
    throw new Error("Failed to add overlays to the thumbnail.");
  }
};
