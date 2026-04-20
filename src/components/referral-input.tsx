"use client";

import { useState } from "react";
import { Gift, CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ReferralInputProps = {
  onSuccess?: (plan: string) => void;
};

export function ReferralInput({ onSuccess }: ReferralInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [codeDescription, setCodeDescription] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch(`/api/referral?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Invalid code");
        setValidated(false);
        return;
      }
      
      if (data.valid) {
        setValidated(true);
        setCodeDescription(data.description || `Unlock ${data.planType === 'lifetime' ? 'lifetime' : 'pro'} access`);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to redeem code");
        return;
      }
      
      setSuccess(data.message);
      onSuccess?.(data.plan);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:border-amber-800/30 dark:from-amber-950/20 dark:to-yellow-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-amber-600" />
          <span className="text-zinc-900 dark:text-white">Have a referral code?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!success ? (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                  setValidated(false);
                }}
                className="flex-1"
                disabled={loading}
              />
              {!validated ? (
                <Button 
                  onClick={handleValidate} 
                  disabled={!code.trim() || loading}
                  variant="outline"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
                </Button>
              ) : (
                <Button 
                  onClick={handleRedeem} 
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redeem"}
                </Button>
              )}
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <XCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            {validated && !error && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                {codeDescription || "Code is valid! Click Redeem to unlock premium."}
              </div>
            )}
            
            <p className="text-xs text-zinc-500">
              Got a referral code from a friend or ICAI event? Enter it here to unlock unlimited access.
            </p>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">{success}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Refresh the page to see your updated plan.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}