import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSupabaseAdmin } from "@/lib/supabase";
import { RevisionPackage } from "@/lib/types";
import { PdfDocument } from "@/components/pdf-document";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get user's actual name from Clerk
  const user = await currentUser();
  const studentName = user?.fullName || user?.firstName || "ReviseCA Student";

  const { searchParams } = new URL(req.url);
  const revisionId = searchParams.get("revisionId");
  if (!revisionId) return NextResponse.json({ error: "revisionId is required." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("revisions").select("*").eq("id", revisionId).eq("user_id", userId).maybeSingle();
  if (!data) return NextResponse.json({ error: "Revision not found." }, { status: 404 });

  const pkg = data.package_json as RevisionPackage;
  const generatedOn = new Date(data.created_at).toLocaleString("en-IN");

  const Doc = <PdfDocument topic={data.topic} studentName={studentName} generatedOn={generatedOn} pkg={pkg} />;

  const pdfBuffer = await renderToBuffer(Doc);
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="reviseca-${revisionId}.pdf"`,
    },
  });
}
