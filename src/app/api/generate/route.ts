import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/file-extract";
import { generateRevisionPackage } from "@/lib/ai";
import { getSupabaseAdmin } from "@/lib/supabase";
import { canGenerate } from "@/lib/usage";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await canGenerate(userId);
    if (!access.allowed) {
      return NextResponse.json(
        { error: "Free limit reached. Upgrade to Pro for unlimited generations." },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const topic = String(formData.get("topic") ?? "").trim();
    const promptTweak = String(formData.get("promptTweak") ?? "").trim();
    const file = formData.get("file");

    if (!topic && !(file instanceof File)) {
      return NextResponse.json({ error: "Enter a topic or upload notes." }, { status: 400 });
    }

    let sourceText = "";
    if (file instanceof File && file.size > 0) {
      sourceText = await extractTextFromFile(file);
    }

    const data = await generateRevisionPackage({
      topic: topic || "Notes-derived topic",
      notesText: sourceText,
      promptTweak,
    });

    const supabase = getSupabaseAdmin();
    const { data: inserted, error } = await supabase
      .from("revisions")
      .insert({
        user_id: userId,
        topic: topic || "Uploaded Notes Revision",
        source_text: sourceText || null,
        package_json: data,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      return NextResponse.json({ error: "Could not save revision." }, { status: 500 });
    }

    return NextResponse.json({ revisionId: inserted.id, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed." },
      { status: 500 },
    );
  }
}
