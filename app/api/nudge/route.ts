// Beebox Order-Value Maximizer — AI Nudge Route
// SERVER ONLY. Runs on Vercel. Never ships to the browser.
// ANTHROPIC_API_KEY is read from environment variables only.

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientName, currentTierLabel, nextTierLabel, piecesNeeded, stickersAtNextTier } = body

    // Validate input
    if (!clientName || !nextTierLabel || !piecesNeeded || !stickersAtNextTier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const prompt = `You are a helpful assistant for Beebox Packaging, a B2B packaging supplier in the Philippines.

A sales staff member is processing an order for a client named "${clientName}".

Current situation:
- The client's current order qualifies for the ${currentTierLabel || "no"} sticker tier.
- They need just ${piecesNeeded} more pieces to reach the ${nextTierLabel} tier.
- At the ${nextTierLabel} tier, they earn ${stickersAtNextTier} free custom stickers.

Write a short, warm, conversational nudge line (1-2 sentences maximum) for the sales staff to say out loud to the client right now. 

Requirements:
- Sound natural for a Filipino business setting, not scripted or pushy
- Mention the exact number of pieces needed and the sticker reward
- Keep it friendly and helpful, like a tip from a trusted supplier
- Do not use em dashes or overly formal language
- Output only the nudge line itself, no labels, no quotes, no explanation`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Anthropic API error:", errorData)
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      )
    }

    const data = await response.json()
    const nudge = data.content?.[0]?.text?.trim() ?? ""

    if (!nudge) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      )
    }

    return NextResponse.json({ nudge })

  } catch (error) {
    console.error("Nudge route error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
