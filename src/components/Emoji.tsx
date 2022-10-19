import { type Component } from "solid-js";

// Create a circle with a radius of 100 with a random emoji in the middle
const Emoji: Component<{ emoji: string; backdrop?: string; class?: string }> = (
  props
) => {
  return (
    <div
      style={`background: ${props.backdrop ?? "#fff"};`}
      class={`
        ${props.class ?? ""}
        w-[48px]
        h-[48px]
        text-[26px]
        flex
        justify-center
        items-center
        text-center
        rounded-full
        font-bold
      `}
    >
      {props.emoji}
    </div>
  );
};

export default Emoji;
