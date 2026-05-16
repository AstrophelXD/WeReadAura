import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (!/\.tsx?$/.test(name)) {
      continue;
    }
    const source = fs.readFileSync(filePath, "utf8");
    if (!source.includes("motion-safe")) {
      continue;
    }
    fs.writeFileSync(filePath, source.replaceAll("motion-safe", "div"));
    console.log("fixed", filePath);
  }
}

walk("src");
