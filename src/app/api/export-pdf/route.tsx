import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { getSupabaseAdmin } from "@/lib/supabase";
import { RevisionPackage } from "@/lib/types";

export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, color: "#1f2937" },
  title: { fontSize: 18, marginBottom: 6, color: "#1847A4" },
  subtitle: { fontSize: 10, marginBottom: 12 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 12, marginBottom: 4, color: "#A17700" },
  bullet: { marginBottom: 2 },
});

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const revisionId = searchParams.get("revisionId");
  if (!revisionId) return NextResponse.json({ error: "revisionId is required." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("revisions").select("*").eq("id", revisionId).eq("user_id", userId).maybeSingle();
  if (!data) return NextResponse.json({ error: "Revision not found." }, { status: 404 });

  const pkg = data.package_json as RevisionPackage;
  const studentName = "ReviseCA Student";
  const generatedOn = new Date(data.created_at).toLocaleString("en-IN");

  const Doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ReviseCA Exam-Ready Package</Text>
        <Text style={styles.subtitle}>
          {studentName} | {data.topic} | {generatedOn}
        </Text>
        {Object.entries(pkg).map(([key, value]) => (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionTitle}>{key}</Text>
            {Array.isArray(value) ? (
              value.map((item, idx) => (
                <Text key={idx} style={styles.bullet}>
                  • {typeof item === "string" ? item : JSON.stringify(item)}
                </Text>
              ))
            ) : (
              <Text>{String(value)}</Text>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );

  const pdfBuffer = await renderToBuffer(Doc);
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="reviseca-${revisionId}.pdf"`,
    },
  });
}
