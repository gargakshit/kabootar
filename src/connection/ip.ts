import { iceServers } from "../config";

const publicIPRegex =
  /(\d+)(?<!10)\.(\d+)(?<!192\.168)(?<!172\.(1[6-9]|2\d|3[0-1]))\.(\d+)\.(\d+)/;

export function getPublicIP(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const pc = new RTCPeerConnection({ ...iceServers });

    let address: string | undefined;
    pc.onicecandidate = (event) => {
      const addr = event.candidate?.address ?? "";
      if (publicIPRegex.test(addr)) {
        address = addr;
      }
    };

    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === "complete") {
        if (address !== undefined) {
          resolve(address);
        } else {
          reject("unable to get public IP");
        }
      }
    };

    pc.createDataChannel("dummy");
    pc.setLocalDescription(await pc.createOffer());
  });
}
