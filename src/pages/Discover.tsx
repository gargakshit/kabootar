import { type Component } from "solid-js";

import RoomItem from "../components/RoomItem";

const rooms = [
  { name: "Recoiled Goblins", emoji: "🍑", backdrop: "#FC7A57" },
  { name: "Oxidising Yeast", emoji: "🍆", backdrop: "#EA7AF4" },
  { name: "Moonlight Rusk", emoji: "🍌", backdrop: "#FEEFA7" },
  { name: "Sinister Shelf", emoji: "🍟", backdrop: "#DB5461" },
  { name: "Squidgy Sausage", emoji: "🍔", backdrop: "#F7B267" },
];

const DiscoverPage: Component = () => {
  return (
    <div class="px-12 pt-16 lg:px-20 lg:pt-20">
      <h1 class="font-bold text-4xl lg:text-5xl heading">Discovering...</h1>
      <p class="text-sm lg:text-base lg:mt-2 mb-8 lg:mb-12">
        Finding nearby shares
      </p>
      {rooms.map((room) => (
        <RoomItem
          emoji={room.emoji}
          name={room.name}
          backdrop={room.backdrop}
        />
      ))}
    </div>
  );
};

export default DiscoverPage;
