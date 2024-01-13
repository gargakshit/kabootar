import { Title } from "@solidjs/meta";
import {
  type Component,
  createSignal,
  For,
  onCleanup,
  onMount,
} from "solid-js";
import { createStore } from "solid-js/store";

import DiscoveredRoom from "../components/DiscoveredRoom";
import { type DiscoveredRoomItem } from "../types/room";
import Discovery from "../connection/discovery";
import PinEntryDialog from "../components/PinEntryDialog";
import Room from "../connection/room";
import { useNavigate } from "@solidjs/router";

const DiscoverHeader: Component = () => {
  // noinspection DuplicatedCode
  const [timer, setTimer] = createSignal(-1);
  const [dots, setDots] = createSignal("");

  onMount(() => {
    setTimer(
      setInterval(() => {
        setDots(dots().length === 3 ? "" : `${dots()}.`);
      }, 200) as unknown as number,
    );
  });

  onCleanup(() => {
    clearInterval(timer());
  });

  return (
    <h1 class="font-bold text-4xl lg:text-5xl heading">{`Discovering${dots()}`}</h1>
  );
};

const DiscoverPage: Component = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = createStore<Record<string, DiscoveredRoomItem>>({});
  const [client, setClient] = createSignal<Discovery | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = createSignal<
    DiscoveredRoomItem | undefined
  >();

  Discovery.connect(
    (room) => {
      setRooms(room.id, room);
    },
    (id) => {
      setRooms(id, undefined);
    },
  ).then((c) => {
    setClient(c);
  });

  onCleanup(() => {
    if (client() !== undefined) {
      client().close();
    }
  });

  async function connect(id: string, pin: string) {
    const key = await Room.getClientKey(id, pin);
    if (!key) {
      return; // TODO(AG): Show error
    }

    navigate(`/${id}#k=${key}`);
  }

  return (
    <>
      <PinEntryDialog
        open={selectedRoom() !== undefined}
        onClickConnect={async (pin) => {
          await connect(selectedRoom().id, pin);
          setSelectedRoom(undefined);
        }}
        close={() => {
          setSelectedRoom(undefined);
        }}
      />
      <div class="px-8 pt-12 pb-8 lg:px-20 lg:pt-20">
        <Title>Kabootar - Discover</Title>

        <DiscoverHeader />
        <p class="text-sm lg:text-base lg:mt-2 mb-8 lg:mb-12">
          Finding nearby shares
        </p>
        <For
          each={Object.values(rooms)}
          fallback={
            <h3 class="text-xl text-zinc-200">No nearby shares found</h3>
          }
        >
          {(room) => (
            <DiscoveredRoom
              room={room}
              onClick={() => {
                setSelectedRoom(room);
              }}
            />
          )}
        </For>
      </div>
    </>
  );
};

export default DiscoverPage;
