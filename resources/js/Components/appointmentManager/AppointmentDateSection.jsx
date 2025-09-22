import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TableHeader } from "./TableHeader";
import { AppointmentRow } from "./AppointmentRow";

export function AppointmentDateSection({
    date,
    appointments,
    setAppointments,
    isLastDate,
    userRole,
}) {
    function onDragEnd() {
        // drag & drop logic
    }

    return (
        <div className="flex flex-col gap-4 border-b-2 border-accent-200 p-4">
            <h3 className="font-bold">
                {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </h3>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="w-full whitespace-nowrap">
                    <TableHeader />
                    <Droppable
                        droppableId={`appointments-${date}`}
                        direction="vertical"
                        type="TR"
                        isDropDisabled={false}
                        ignoreContainerClipping
                        isCombineEnabled={false}
                    >
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {appointments.map((appointment, index) => (
                                    <AppointmentRow
                                        key={appointment.id}
                                        appointment={appointment}
                                        index={index}
                                        setAppointments={setAppointments}
                                        isLast={
                                            isLastDate &&
                                            index === appointments.length - 1
                                        }
                                        userRole={userRole}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
}
