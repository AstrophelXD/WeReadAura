import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "neobrutalism-components-local");

if (existsSync(path.join(target, "src", "components", "ui", "button.tsx"))) {
  console.log("neobrutalism-components-local already present");
  process.exit(0);
}

console.log("Cloning neobrutalism-components into neobrutalism-components-local …");
execSync(
  "git clone --depth 1 https://github.com/ekmas/neobrutalism-components.git neobrutalism-components-local",
  { cwd: root, stdio: "inherit" },
);
