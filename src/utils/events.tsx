import { DOMElement } from "solid-js/jsx-runtime";

interface EventHandler<T, E extends Event> {
  (
    e: E & {
      currentTarget: T;
      target: DOMElement;
    }
  ): void;
}
interface BoundEventHandler<T, E extends Event> {
  0: (
    data: any,
    e: E & {
      currentTarget: T;
      target: DOMElement;
    }
  ) => void;
  1: any;
}

type EventHandlerUnion<T, E extends Event> =
  | EventHandler<T, E>
  | BoundEventHandler<T, E>;

export type { EventHandler, BoundEventHandler, EventHandlerUnion };
