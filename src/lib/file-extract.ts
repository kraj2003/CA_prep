import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (extension === "txt") {
    return buffer.toString("utf-8");
  }

  if (extension === "pdf") {
    const pdf = await pdfParse(buffer);
    return pdf.text;
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Upload PDF, TXT, or DOCX.");
}
