import { GenerationForm } from "@/components/generation-form";

export default function GeneratePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#1847A4]">Generate</h1>
      <GenerationForm />
    </main>
  );
}
