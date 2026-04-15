import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PricingPage() {
  const { userId } = await auth();
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold text-[#1847A4]">Pricing</h1>
        <p className="text-zinc-600 dark:text-zinc-300">Choose a plan that matches your exam sprint timeline.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">₹0</p>
            <p>3 generations per month</p>
            <p>Topic and notes upload support</p>
            <p>History saved to dashboard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pro
              <Badge>Most Popular</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">₹499/month</p>
            <p>Unlimited generations + priority</p>
            <p>PDF export for all packages</p>
            <form action="/api/checkout/subscription" method="POST">
              <input type="hidden" name="userId" value={userId ?? ""} />
              <Button type="submit" disabled={!userId}>
                Start Subscription
              </Button>
            </form>
            <form action="/api/checkout/one-time" method="POST">
              <input type="hidden" name="userId" value={userId ?? ""} />
              <Button type="submit" variant="outline" disabled={!userId}>
                Buy Single Package (₹99)
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
