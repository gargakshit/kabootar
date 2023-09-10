import { FileDownloader } from "./index";

export interface DownloadableStreamMetadata {
  name: string;
  size: number;
  seed: number;
  port: MessagePort;
  stream: ReadableStream;
}

export class StreamFileDownloader implements FileDownloader {
  sw: ServiceWorker;
  controller: ReadableStreamController<ArrayBuffer>;
  seed: number;

  constructor(
    public name: string,
    public size: number,
  ) {
    this.sw = navigator.serviceWorker.controller;
  }

  private static isSafari() {
    const ua = navigator.userAgent;
    return ua.indexOf("Chrome") === -1 && ua.indexOf("Safari") !== -1;
  }

  static isAvailable() {
    return (
      !this.isSafari() &&
      navigator.serviceWorker.controller.state === "activated"
    );
  }

  async initialize() {
    this.seed = Math.floor(Math.random() * 1_000_000_000);

    const stream = new ReadableStream<ArrayBuffer>({
      start: (controller) => {
        this.controller = controller;
      },
      cancel: () => {
        // TODO(AG): handle cancellation
      },
    });
    const channel = new MessageChannel();
    this.sw.postMessage(
      {
        type: "stream",
        data: {
          name: this.name,
          size: this.size,
          seed: this.seed,
          port: channel.port2,
          stream: stream,
        } as DownloadableStreamMetadata,
      },
      [channel.port2, stream],
    );

    const url = await new Promise<string>((resolve) => {
      channel.port1.onmessage = (event) => {
        resolve(event.data);
        channel.port1.close();
        channel.port2.close();
      };
    });

    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    iframe.src = url;
    iframe.name = "iframe";
    document.body.appendChild(iframe);
  }

  // skipcq: JS-0116, JS-0376
  async append(data: ArrayBuffer) {
    this.controller.enqueue(data);
  }

  // skipcq: JS-0116, JS-0376
  async finalize() {
    this.controller.close();
  }
}
