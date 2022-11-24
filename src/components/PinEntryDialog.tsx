import { type Component, createSignal } from "solid-js";
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "solid-headless";
import { Portal } from "solid-js/web";

const PinEntryDialog: Component<{
  open: boolean;
  onClickConnect: (pin: string) => void;
  close: () => void;
}> = (props) => {
  const [pin, setPin] = createSignal("");

  return (
    <Portal>
      <Transition appear show={props.open}>
        <Dialog
          isOpen
          class="fixed inset-0 z-[99999] overflow-y-auto"
          onClose={props.close}
        >
          <div class="min-h-screen px-4 flex items-center justify-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
            </TransitionChild>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel class="dialog-panel w-full">
                <DialogTitle as="h3" class="text-lg font-bold leading-6">
                  Enter the PIN
                </DialogTitle>
                <div class="mt-4 w-full">
                  <input
                    type="number"
                    class="border-none outline-none rounded p-2 w-full"
                    style={{ background: "rgba(255, 255, 255, 0.2)" }}
                    placeholder="000000"
                    maxlength="6"
                    value={pin()}
                    onChange={(e) => setPin(e.currentTarget.value)}
                  />
                </div>
                <div class="mt-4 flex gap-4">
                  <button
                    type="button"
                    class="rounded font-bold px-3 py-2 w-full"
                    style={{ background: "rgba(255, 100, 100, 0.7)" }}
                    onClick={props.close}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    class="rounded font-bold px-3 py-2 w-full"
                    style={{ background: "rgba(255, 255, 255, 0.2)" }}
                    onClick={() => {
                      const currPin = pin();
                      setPin("");
                      props.onClickConnect(currPin);
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        const currPin = pin();
                        setPin("");
                        props.onClickConnect(currPin);
                      }
                    }}
                  >
                    Connect
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </Portal>
  );
};

export default PinEntryDialog;
