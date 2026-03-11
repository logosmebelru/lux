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

function parseRange(rangeHeader, size) {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return null;
  }

  const [startToken, endToken] = rangeHeader.slice("bytes=".length).split(",", 1)[0].split("-");
  let start = startToken === "" ? null : Number.parseInt(startToken, 10);
  let end = endToken === "" ? null : Number.parseInt(endToken, 10);

  if ((start !== null && Number.isNaN(start)) || (end !== null && Number.isNaN(end))) {
    return "invalid";
  }

  if (start === null && end === null) {
    return "invalid";
  }

  if (start === null) {
    const suffixLength = end;
    if (!suffixLength || suffixLength <= 0) {
      return "invalid";
    }

    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    if (start >= size || start < 0) {
      return "invalid";
    }

    if (end === null || end >= size) {
      end = size - 1;
    }
  }

  if (end < start) {
    return "invalid";
  }

  return { start, end };
}

function sendFile(request, response, filePath) {
  const extension = extname(filePath);
  const contentType = mimeTypes[extension] ?? "application/octet-stream";
  const stats = statSync(filePath);
  const cacheControl = extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable";
  const range = parseRange(request.headers.range, stats.size);

  if (range === "invalid") {
    response.writeHead(416, {
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
      "Content-Range": `bytes */${stats.size}`,
      "Content-Type": contentType
    });
    response.end();
    return;
  }

  if (range) {
    const contentLength = range.end - range.start + 1;

    response.writeHead(206, {
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
      "Content-Length": contentLength,
      "Content-Range": `bytes ${range.start}-${range.end}/${stats.size}`,
      "Content-Type": contentType
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath, { start: range.start, end: range.end }).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Accept-Ranges": "bytes",
    "Cache-Control": cacheControl,
    "Content-Length": stats.size,
    "Content-Type": contentType
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

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
    sendFile(request, response, candidatePath);
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
