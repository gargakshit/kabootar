import { type Component } from "solid-js";

import Emoji from "./Emoji";

const RoomItem: Component<{
  backdrop: string;
  class?: string;
  emoji?: string;
  name?: string;
  onClick?: () => void;
}> = (props) => {
  return (
    <div class="flex flex-row align-center w-72 mb-4 mt-2">
      <Emoji emoji={props.emoji} backdrop={props.backdrop} />
      <div class="w-5" aria-hidden></div>
      <p class="flex-3 text-xl self-center font-light">{props.name}</p>
    </div>
  );
};

export default RoomItem;
