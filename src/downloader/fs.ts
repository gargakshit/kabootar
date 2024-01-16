import { FileDownloader } from "./index";

export class FSFileDownloader implements FileDownloader {
  private handle: FileSystemHandle;
  private writable: FileSystemWritableFileStream;
  private position: number;

  constructor(
    public name: string,
    public size: number,
  ) {}

  async initialize() {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: this.name,
      });
      const writable = await handle.createWritable({ keepExistingData: false });
      this.handle = handle;
      this.writable = writable;
      this.position = 0;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async append(data: ArrayBuffer) {
    const oldPosition = this.position;
    this.position += data.byteLength;
    await this.writable.write({ type: "write", position: oldPosition, data });
  }

  async finalize() {
    await this.writable.close();
  }
}
