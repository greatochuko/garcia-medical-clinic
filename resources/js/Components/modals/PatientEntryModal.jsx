import React, { useEffect, useState } from "react";
import ModalContainer from "../layout/ModalContainer";
import XIcon from "../icons/XIcon";
import Input from "../layout/Input";

export default function PatientEntryModal({
    open,
    closeModal: closeEntryModal,
    entryList: initialEntryList,
    onSaveEntry,
}) {
    const [entryList, setEntryList] = useState(initialEntryList ?? []);

    useEffect(() => {
        if (open) {
            setEntryList(initialEntryList ?? []);
        }
    }, [initialEntryList, open]);

    function closeModal() {
        closeEntryModal();
    }

    function removeFromList(entryIndex) {
        setEntryList((prev) => prev.filter((e, i) => i !== entryIndex));
    }

    return (
        <ModalContainer closeModal={closeModal} open={open}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`flex w-[90%] max-w-2xl flex-col divide-y-2 divide-accent-200 rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between p-2 px-4 pr-2">
                    <h5 className="font-semibold">Modify Entry</h5>
                    <button
                        onClick={closeModal}
                        className="rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex h-72 flex-col gap-2 overflow-y-auto p-4">
                    {entryList.map((ent, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Input
                                value={ent}
                                onChange={(ev) =>
                                    setEntryList((prev) =>
                                        prev.map((e, index) =>
                                            i === index ? ev.target.value : e,
                                        ),
                                    )
                                }
                                className="w-0 flex-1"
                            />
                            <button
                                onClick={() => removeFromList(i)}
                                type="button"
                                className="rounded-md border border-transparent p-2.5 duration-100 hover:border-accent-400 hover:bg-accent-300"
                            >
                                <img
                                    src="/assets/icons/delete-icon.svg"
                                    alt="Edit Icon"
                                    width={16}
                                    height={16}
                                    className="h-4 w-4"
                                />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-4 p-4 text-xs">
                    <button
                        onClick={closeModal}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSaveEntry(entryList)}
                        className="btn flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
