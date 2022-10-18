import { Component, JSX } from "solid-js";
import type { EventHandlerUnion } from "../utils/events";

const PrimaryButton: Component<{
  onClick?: EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  disabled?: boolean;
  children: JSX.Element;
  class?: string;
}> = (props) => {
  return (
    <button
      class={`
        bg-white
        text-black
        font-medium
        text-[1.2rem]
        px-12
        py-[0.875rem]
        rounded-lg
        z-50
        ${props.class ? props.class : ""}
      `}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

const SexyButton: Component<{
  onClick?: EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  disabled?: boolean;
  children: JSX.Element;
  class?: string;
  href?: string;
}> = (props) => {
  return (
    <div class="relative">
      <div class="absolute background-goo blur-3xl w-52 h-12" />
      <button
        class={`
          text-white
          font-medium
          text-[1.2rem]
          rounded-lg
          background-goo
          p-[4px]
          absolute
          w-52
          ${props.class ? props.class : ""}
        `}
        disabled={props.disabled}
        // on click navigate to discover page
        onClick={props.onClick}

      >
        <a href={props.href}>
          <div
            class="
          button-sexy-div-p
          rounded-md
          py-[0.875rem]
          bg-black
          hover:bg-transparent
          hover:text-black
          transition-colors
          duration-200
        "
          >
            {props.children}
          </div>
        </a>
      </button>
    </div>
  );
};

export { PrimaryButton, SexyButton };
