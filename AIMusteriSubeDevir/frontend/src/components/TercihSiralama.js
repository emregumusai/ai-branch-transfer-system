// frontend/src/components/TercihSiralama.js

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 1.3,
    margin: `0 0 ${grid}px 0`,
    borderRadius: 7,
    background: isDragging ? "#be1e2d22" : "#fff",
    border: "1.5px solid #be1e2d77",
    fontWeight: 600,
    color: "#222",
    fontSize: 16,
    boxShadow: isDragging ? "0 2px 8px #be1e2d22" : "0 1px 4px #ccc",
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#fff0f1" : "#f7f7f7",
    padding: grid,
    borderRadius: 9,
    minHeight: 180,
    marginBottom: 18
});

export default function TercihSiralama({ tercihler, onSiralamaOnayla, onIptal }) {
    const [items, setItems] = React.useState([...tercihler]);

    function onDragEnd(result) {
        if (!result.destination) return;
        const reordered = Array.from(items);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        setItems(reordered);
    }

    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(50, 30, 40, 0.17)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
            <div style={{ background: "#fff", borderRadius: 15, padding: 32, minWidth: 360, maxWidth: "92vw", boxShadow: "0 2px 22px #be1e2d22" }}>
                <h2 style={{ color: "#be1e2d", marginBottom: 10, fontSize: 20 }}>Tercihlerinizi Öncelik Sırasına Göre Sürükleyin</h2>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tercihler">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {items.map((tercih, idx) => (
                                    <Draggable key={tercih} draggableId={tercih} index={idx}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                {idx + 1}. {tercih}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button
                        onClick={() => onSiralamaOnayla(items)}
                        style={{
                            padding: "8px 20px", background: "#be1e2d", color: "#fff",
                            border: "none", borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: "pointer"
                        }}>
                        Sıralamayı Onayla
                    </button>
                    <button
                        onClick={onIptal}
                        style={{
                            padding: "8px 20px", background: "#ececec", color: "#4e4e4e",
                            border: "none", borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: "pointer"
                        }}>
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
}
