import { Component } from "solid-js";
import RoomItem from "../components/RoomItem";

const fadeVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
};


const DiscoverPage: Component = () => {

    return (
        <div class="h-100 flex flex-col items-left ml-16 ">
            <h1 class="font-bold text-5xl  heading mt-24">Discovering...</h1>
            <div class="h-2" aria-hidden></div>
            <p>Finding nearby shares</p>
            <div class="h-14" aria-hidden />
            {Rooms.map((room) => (
                <RoomItem emoji={room.emoji} name={room.name} backdrop={room.backdrop} />
            ))}
            

        </div>
    )
}



const Rooms = [
    { name: "Recoiled Goblins", emoji: "🍑", backdrop: "#FC7A57" },
    { name: "Oxidising Yeast", emoji: "🍆", backdrop: "#EA7AF4" },
    { name: "Moonlight Rusk", emoji: "🍌", backdrop: "#FEEFA7" },
    { name: "Sinister Shelf", emoji: "🍟", backdrop: "#DB5461" },
    { name: "Squidgy Sausage", emoji: "🍔", backdrop: "#F7B267" },
];


export default DiscoverPage;