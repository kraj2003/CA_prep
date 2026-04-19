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
    return NextResponse.json(
      {
        error: "Generation failed",
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}