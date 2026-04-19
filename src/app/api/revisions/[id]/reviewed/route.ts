import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { isRevised?: boolean } | null;
  if (typeof body?.isRevised !== "boolean") {
    return NextResponse.json({ error: "isRevised must be a boolean." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("revisions")
    .update({ is_revised: body.isRevised })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: "Could not update revised status." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
