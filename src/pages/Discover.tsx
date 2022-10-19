import { Component } from "solid-js";
import { SexyButton } from "../components/Button";
import RoomItem from "../components/RoomItem";

const fadeVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
};

// TODO: make go home button responsive

const DiscoverPage: Component = () => {

    return (<div class="ml-16 mr-16 mt-24 h-100">
        <div class="flex flex-row justify-between header">
            <h1 class="font-bold text-5xl heading">Discovering...</h1>
            <div class="mr-16 w-52">
                <SexyButton href="/">Go Home</SexyButton>
            </div>
        </div>
        <div class="flex flex-col items-left ">
            <div class="h-2" aria-hidden></div>
            <p>Finding nearby shares</p>
            <div class="h-14" aria-hidden />
            {Rooms.map((room) => (
                <RoomItem emoji={room.emoji} name={room.name} backdrop={room.backdrop} />
            ))}
        </div>
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