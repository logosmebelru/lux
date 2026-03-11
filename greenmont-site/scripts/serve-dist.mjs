import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? "4184");
const distDir = normalize(join(process.cwd(), "dist"));
const indexHtmlPath = join(distDir, "index.html");

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

if (!existsSync(indexHtmlPath)) {
  console.error("dist/index.html is missing. Run `npm run build` first.");
  process.exit(1);
}

const indexHtml = readFileSync(indexHtmlPath);

function sendFile(response, filePath) {
  const extension = extname(filePath);
  const contentType = mimeTypes[extension] ?? "application/octet-stream";
  const stats = statSync(filePath);

  response.writeHead(200, {
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    "Content-Length": stats.size,
    "Content-Type": contentType
  });

  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  if (!request.url) {
    response.writeHead(400).end("Bad Request");
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: true, port }));
    return;
  }

  const candidatePath = normalize(join(distDir, pathname.replace(/^\/+/, "")));
  const isSafePath = candidatePath.startsWith(distDir);

  if (isSafePath && existsSync(candidatePath) && statSync(candidatePath).isFile()) {
    sendFile(response, candidatePath);
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-cache",
    "Content-Type": "text/html; charset=utf-8"
  });
  response.end(indexHtml);
});

server.listen(port, host, () => {
  console.log(`Greenmont server listening on http://${host}:${port}`);
  console.log(`Health endpoint: http://${host}:${port}/health`);
});
