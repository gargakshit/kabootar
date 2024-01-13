import { getPublicIP } from "./ip";
import { RT } from "../config";
import { type DiscoveredRoomItem } from "../types/room";
import { emojiBackground } from "../utils/emoji";

class Discovery {
  private constructor(
    private ws: WebSocket,
    private added: (room: DiscoveredRoomItem) => void,
    private removed: (id: string) => void,
  ) {
    ws.addEventListener("message", this.messageListener.bind(this));
    ws.addEventListener("close", this.closeListener.bind(this));
  }

  static async connect(
    added: (room: DiscoveredRoomItem) => void,
    removed: (id: string) => void,
  ): Promise<Discovery | undefined> {
    try {
      const ip = await getPublicIP();
      const ws = new WebSocket(`${RT.disvover}?ip=${ip}`);

      return new Discovery(ws, added, removed);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  close() {
    this.ws.close();
  }

  private messageListener(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      switch (data[0]) {
        case "0":
          this.onAddMessage(data);
          break;

        case "1":
          this.onRemoveMessage(data);
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }

  private onAddMessage(data: string[]) {
    // [0, id, name, emoji]
    if (data.length < 4 || data[0] !== "0") {
      return;
    }

    this.added({
      id: data[1],
      background: emojiBackground[data[3]],
      name: data[2],
      emoji: data[3],
    });
  }

  private onRemoveMessage(data: string[]) {
    // [1, id]
    if (data.length < 2 || data[0] !== "1") {
      return;
    }

    this.removed(data[1]);
  }

  private closeListener(_event: CloseEvent) {}
}

export default Discovery;
