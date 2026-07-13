"use client";

import { Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeviceId } from "@/hooks/use-device-id";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const deviceId = useDeviceId();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Local preferences for the browser session. Supabase project credentials stay in environment variables.
        </p>
      </div>

      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>
              System
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input readOnly value={deviceId || "Generating..."} />
            <p className="text-sm text-muted-foreground">
              This anonymous id keys favorites and search history. With the current database RLS policy, production writes
              require either a custom JWT `device_id` claim or RPC wrappers that enforce ownership inside Postgres.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                window.localStorage.removeItem("hashfame_device_id");
                window.location.reload();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Reset device id
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Add these values to `.env.local` after the UI build is complete:</p>
            <pre className="overflow-auto rounded-lg border border-border bg-background/70 p-4 text-xs">
              {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PROJECT_REF=...`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
