import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const dynamic = "force-static";

export default async function ReadmePage() {
  const filePath = path.join(process.cwd(), "README.md");
  const markdown = fs.readFileSync(filePath, "utf8");

  const processed = await remark().use(html).process(markdown);
  const htmlContent = processed.toString();

  return (
    <div className="flex h-[calc(100vh-164px)] w-full bg-gray-50 p-4 gap-4">
      <div className="prose p-8 w-full overflow-auto">
        <div className="w-full" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}
