import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";

import { PrimaryButton, SexyButton } from "../components/Button";
import Room from "../connection/room";
import { numClientsSignal, roomSignal } from "./Share";

const HomePage: Component = () => {
  const navigate = useNavigate();
  const [shareDisabled, setShareDisabled] = createSignal(false);
  const [drag, setDrag] = createSignal(false);

  const [, setRoom] = roomSignal;
  const [, setNumClients] = numClientsSignal;

  const handleFile = async (file: File) => {
    setShareDisabled(true);
    const room = await Room.create(file, {
      numClientsChanged(n: number) {
        setNumClients(n);
      },
    });

    setRoom(room);
    navigate(`/${room.id}#${room.constructHash()}`);
    setShareDisabled(false);
  }

  const createRoom = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", async (_) => {
      if (input.files.length >= 1) {
        const file = input.files[0];
        await handleFile(file);
      }
    });
    input.click();
  };

  const handleDrag = (e: DragEvent) => {
    if (e.type === "dragenter" || e.type === "dragover") {
      e.preventDefault();
      setDrag(true);
      setShareDisabled(true);
    } else if (e.type === "dragleave") {
      e.preventDefault();
      setDrag(false);
      setShareDisabled(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    if (e.type === "drop") {
      e.preventDefault();
      if (e.dataTransfer.files.length >= 1) {
        const file = e.dataTransfer.files[0];
        await handleFile(file);
      }
    }
  }


  return (
    <div class="h-full flex flex-col items-center justify-center">
      <Title>Kabootar</Title>

      <h1 class="heading text-6xl md:text-8xl font-extrabold tracking-tight text-goo goo-head">
        Kabootar
      </h1>

      <div class="h-14" aria-hidden />

      <div class={
        drag()
          ? "flex flex-col space-y-5 w-52 sharing-buttons background-element"
          : "flex flex-col space-y-5 w-52 sharing-buttons foreground-element"
      }>
        <PrimaryButton
          class="z-10"
          disabled={shareDisabled()}
          onClick={createRoom}
        >
          {shareDisabled() ? "Hang on..." : "Share a file"}
        </PrimaryButton>
        <SexyButton
          class="w-52"
          disabled={shareDisabled()}
          onClick={() => {
            navigate("/discover");
          }}
        >
          Discover
        </SexyButton>
      </div>
      <div class={
        drag()
          ? "fixed inset-0 z-10 flex items-center justify-center foreground-element"
          : "fixed inset-0 z-10 flex items-center justify-center background-element"
      }
        onDragEnter={handleDrag}
        ondragover={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop} >
        <div class="absolute inset-0 bg-black opacity-50" />
        <div class="drop-model rounded-lg shadow-lg">
          <h1 class="text-2xl font-bold drop-text text-goo">Drop the file here to share.</h1>
        </div>
      </div>
    </div>
  )
};

export default HomePage;
