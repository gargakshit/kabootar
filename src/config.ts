export const iceServers: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const rtBase = "/rt/v1";

const wsBase_ = new URL(rtBase, `${location.protocol}//${location.host}`);
wsBase_.protocol = wsBase_.protocol.replace("http", "ws");

const wsBase = wsBase_.toString();

export const RT = {
  room: `${rtBase}/room`,
  roomWSBase: `${wsBase}/ws`,
  disvover: `${wsBase}/discover`,
};
