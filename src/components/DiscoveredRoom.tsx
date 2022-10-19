import { type Component } from "solid-js";

const DiscoveredRoom: Component<{
  backdrop: string;
  emoji: string;
  name: string;
  onClick?: () => void;
}> = (props) => {
  return (
    <div class="flex flex-row items-center my-4 gap-4">
      <p
        style={{ background: props.backdrop }}
        class="
          w-[48px]
          h-[48px]
          text-[26px]
          flex
          justify-center
          items-center
          text-center
          rounded-full
          font-bold
        "
      >
        {props.emoji}
      </p>
      <p class="text-xl">{props.name}</p>
    </div>
  );
};

export default DiscoveredRoom;
