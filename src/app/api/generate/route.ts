import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/file-extract";
import { generateRevisionPackage } from "@/lib/ai";
import { getSupabaseAdmin } from "@/lib/supabase";
import { canGenerate } from "@/lib/usage";

export const maxDuration = 60; // Allow up to 60s for AI generation

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await canGenerate(userId);
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: "Free limit reached",
          message: "You've used all 3 free packages this month. Upgrade to Pro for unlimited generations.",
          upgradeUrl: "/pricing",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const topic = String(formData.get("topic") ?? "").trim();
    const promptTweak = String(formData.get("promptTweak") ?? "").trim();
    const caLevel = String(formData.get("caLevel") ?? "").trim();
    const paper = String(formData.get("paper") ?? "").trim();
    const attemptMonthRaw = String(formData.get("attemptMonth") ?? "").trim();
    const attemptMonth = attemptMonthRaw === "May" || attemptMonthRaw === "Nov" ? attemptMonthRaw : undefined;
    const file = formData.get("file");

    if (!topic && !(file instanceof File && file.size > 0)) {
      return NextResponse.json({ error: "Please enter a topic or upload notes." }, { status: 400 });
    }

    let sourceText = "";
    if (file instanceof File && file.size > 0) {
      try {
        sourceText = await extractTextFromFile(file);
      } catch (e) {
        return NextResponse.json(
          { error: `Could not read your file: ${e instanceof Error ? e.message : "Unknown error"}` },
          { status: 400 },
        );
      }
    }

    const effectiveTopic = topic || "Topic from uploaded notes";

    const data = await generateRevisionPackage({
      topic: effectiveTopic,
      notesText: sourceText || undefined,
      promptTweak: promptTweak || undefined,
      caLevel: caLevel || undefined,
      paper: paper || undefined,
      attemptMonth,
    });

    const supabase = getSupabaseAdmin();
    const { data: inserted, error } = await supabase
      .from("revisions")
      .insert({
        user_id: userId,
        topic: effectiveTopic,
        source_text: sourceText || null,
        package_json: data,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("Supabase insert error:", error);
      // Still return the data even if save fails
      return NextResponse.json({
        revisionId: null,
        data,
        topic: effectiveTopic,
        warning: "Package generated but could not be saved. Please copy what you need.",
      });
    }

    return NextResponse.json({ revisionId: inserted.id, data, topic: effectiveTopic });
  } catch (error) {
    console.error("Generation error:", error);
    
    let errorMessage = "An unexpected error occurred. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("JSON")) {
        errorMessage = "The AI returned an invalid response. This sometimes happens with complex topics. Please try again with a simpler or more specific topic.";
      } else if (error.message.includes("rate limit") || error.message.includes("429")) {
        errorMessage = "Server is busy. Please wait a moment and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "The request took too long. Please try a shorter topic.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        error: "Generation failed",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}