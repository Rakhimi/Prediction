import fs from "fs/promises";
import path from "path";

export async function getAccuracy() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "accuracy.json"
  );

  const json = await fs.readFile(
    filePath,
    "utf8"
  );

  return JSON.parse(json);
}