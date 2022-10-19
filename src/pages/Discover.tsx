import { Title } from "@solidjs/meta";
import { type Component } from "solid-js";

import { type DiscoveredRoomItem } from "../types/room";
import DiscoveredRoom from "../components/DiscoveredRoom";

const DiscoverPage: Component = () => {
  const rooms: DiscoveredRoomItem[] = [
    { name: "Recoiled Goblins", emoji: "🍑", background: "#FC7A57" },
    { name: "Oxidising Yeast", emoji: "🍆", background: "EA7AF4" },
    { name: "Moonlight Rusk", emoji: "🍌", background: "#FEEFA7" },
    { name: "Sinister Shelf", emoji: "🍟", background: "#DB5461" },
    { name: "Squidgy Sausage", emoji: "🍔", background: "#F7B267" },
  ];

  return (
    <div class="px-12 pt-16 lg:px-20 lg:pt-20">
      <Title>Kabootar - Discover</Title>

      <h1 class="font-bold text-4xl lg:text-5xl heading">Discovering...</h1>
      <p class="text-sm lg:text-base lg:mt-2 mb-8 lg:mb-12">
        Finding nearby shares
      </p>
      {rooms.map((room) => (
        <DiscoveredRoom
          emoji={room.emoji}
          name={room.name}
          backdrop={room.background}
        />
      ))}
    </div>
  );
};

export default DiscoverPage;
