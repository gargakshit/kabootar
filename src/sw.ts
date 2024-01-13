/// <reference lib="WebWorker" />

import { DownloadableStreamMetadata } from "./downloader/stream";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  self.skipWaiting();
  console.info("Service worker installed");
});

self.addEventListener("activate", () => {
  self.clients.claim();
  console.info("Service worker activated");
});

const downloadable = new Map<string, DownloadableStreamMetadata>();
const streamURLBase = "stream";

self.addEventListener("message", (event) => {
  if (event.data.type === "stream") {
    const metadata = event.data.data as DownloadableStreamMetadata;
    const url = `${self.registration.scope}${streamURLBase}/${metadata.seed}`;

    downloadable.set(url, metadata);
    // event.ports[0].postMessage(url);
    metadata.port.postMessage(url);
  }
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (url.endsWith("/stream/ping")) {
    return event.respondWith(new Response("pong"));
  }

  if (!downloadable.has(url)) {
    return;
  }

  const stream = downloadable.get(url);
  downloadable.delete(url);

  const headers = new Headers({
    "Content-Type": "application/octet-stream",
    "Content-Length": stream.size.toString(),
    "Content-Disposition": `attachment; filename="${encodeURIComponent(
      stream.name,
    )}"`,
  });

  event.respondWith(new Response(stream.stream, { headers }));
});
