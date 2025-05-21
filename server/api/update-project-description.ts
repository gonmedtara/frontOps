import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const { slug, body } = await readBody(event);
  const projectFile = path.resolve("./content/projects", slug, "project.md");

  const lines = fs.readFileSync(projectFile, "utf-8").split("---");
  if (lines.length < 3) throw new Error("Invalid frontmatter format");

  const newContent = `---${lines[1]}---\n\n${body}`;
  fs.writeFileSync(projectFile, newContent, "utf-8");

  return { success: true };
});
