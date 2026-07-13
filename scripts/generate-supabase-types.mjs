import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRef = process.env.SUPABASE_PROJECT_REF;

if (!projectRef) {
  console.error("Missing SUPABASE_PROJECT_REF. Add it to your environment before running this script.");
  process.exit(1);
}

const output = execFileSync(
  "npx",
  ["supabase", "gen", "types", "typescript", "--project-id", projectRef],
  {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  }
);

writeFileSync(resolve("types/supabase.ts"), output);
console.log("Generated types/supabase.ts");
