import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, apiKey } = await req.json();

    if (!text || !voiceId) {
      return NextResponse.json({ error: "Missing text or voiceId" }, { status: 400 });
    }

    const elevenKey = apiKey || process.env.ELEVEN_LABS_API_KEY;

    if (!elevenKey) {
      return NextResponse.json({ error: "No API Key provided" }, { status: 401 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
          "Content-Type": "application/json",
          "accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // Return the audio stream directly
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
