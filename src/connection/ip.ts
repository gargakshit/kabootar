import { iceServers } from "../config";

const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}.\d{1,3}/;

export function getPublicIP(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const pc = new RTCPeerConnection({ ...iceServers });

    let address: string | undefined;
    pc.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        return;
      }

      if (ipRegex.test(event.candidate.candidate)) {
        const [ip] = ipRegex.exec(event.candidate.candidate);
        if (isPublicIP(ip)) {
          address = ip;
          pc.close();
          resolve(address);
        }
      }
    });

    pc.addEventListener("icegatheringstatechange", () => {
      if (pc.iceGatheringState === "complete") {
        pc.close();
        if (address === undefined) {
          reject("unable to get public IP");
        }
      }
    });

    pc.createDataChannel("dummy");
    await pc.setLocalDescription(await pc.createOffer());
  });
}

function isPublicIP(ip: string): boolean {
  if (ip.startsWith("10.")) {
    return false;
  }

  if (ip.startsWith("192.168.")) {
    return false;
  }

  if (ip.startsWith("172.")) {
    const [_, b] = ip.split(".");
    try {
      const bNum = Number.parseInt(b);
      if (bNum >= 16 && bNum < 32) {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  return true;
}
