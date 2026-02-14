// frontend/src/components/TercihSiralama.js

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Paper,
    Typography,
    IconButton
} from '@mui/material';
import {
    DragIndicator as DragIndicatorIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// StrictMode compatibility wrapper for React 18/19
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

    return <Droppable {...props}>{children}</Droppable>;
};

export default function TercihSiralama({ tercihler, onSiralamaOnayla, onIptal }) {
    const [items, setItems] = useState([...tercihler]);

    // Layout ready gate - prevents rendering until DOM is fully settled
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setIsLayoutReady(true);
        });

        return () => {
            cancelAnimationFrame(frame);
            setIsLayoutReady(false);
        };
    }, []);

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const reordered = Array.from(items);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setItems(reordered);
    };

    const handleConfirm = () => {
        onSiralamaOnayla(items);
    };

    // Don't render until layout is ready
    if (!isLayoutReady) {
        return null;
    }

    return (
        <Dialog
            open={true}
            onClose={onIptal}
            maxWidth="md"
            fullWidth
            keepMounted
            disablePortal
            transitionDuration={0}
            TransitionProps={{ timeout: 0 }}
            PaperProps={{
                elevation: 0,
                sx: {
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.97)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 24px 48px rgba(10, 37, 64, 0.15)',
                    overflow: 'hidden',
                    p: 0,
                    transform: 'none !important',
                    transition: 'none !important',
                    animation: 'none !important'
                }
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(10, 37, 64, 0.4)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.02em',
                    position: 'relative',
                    m: 0,
                    mt: 0,
                    mx: 0,
                    px: 3,
                    py: 2.5,
                    width: '100%',
                    borderBottom: '3px solid',
                    borderColor: 'primary.dark',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DragIndicatorIcon sx={{ fontSize: '1.8rem', opacity: 0.9 }} />
                    <span>Tercih Sıralamanızı Belirleyin</span>
                </Box>
                <IconButton
                    onClick={onIptal}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'rotate(90deg)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 3 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2.5,
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'primary.dark'
                    }}
                >
                    Tercihlerinizi sürükleyerek öncelik sıranızı oluşturun. En önemli tercihiniz üstte olmalı.
                </Typography>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <StrictModeDroppable droppableId="tercihler">
                        {(provided, snapshot) => (
                            <Box
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                sx={{
                                    background: snapshot.isDraggingOver 
                                        ? 'rgb(227, 242, 253)'
                                        : 'rgb(248, 250, 252)',
                                    borderRadius: 2,
                                    p: 1.5,
                                    minHeight: 200,
                                    transition: 'background 0.2s',
                                    border: '2px dashed',
                                    borderColor: snapshot.isDraggingOver ? 'primary.main' : 'grey.300'
                                }}
                            >
                                {items.map((tercih, index) => (
                                    <Draggable 
                                        key={tercih} 
                                        draggableId={tercih} 
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={provided.draggableProps.style}
                                            >
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2.5,
                                                        mb: 1.5,
                                                        minHeight: 80,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                                        background: snapshot.isDragging 
                                                            ? 'rgb(227, 242, 253)'
                                                            : 'rgb(255, 255, 255)',
                                                        borderLeft: 4,
                                                        borderColor: snapshot.isDragging ? 'primary.main' : 'grey.300',
                                                        borderRadius: 2,
                                                        boxShadow: snapshot.isDragging 
                                                            ? '0 8px 24px rgba(30, 136, 229, 0.25)' 
                                                            : '0 2px 8px rgba(10, 37, 64, 0.08)',
                                                        userSelect: 'none'
                                                    }}
                                                >
                                                    <DragIndicatorIcon 
                                                        sx={{ 
                                                            color: snapshot.isDragging ? 'primary.main' : 'grey.400',
                                                            fontSize: '1.8rem',
                                                            transition: 'color 0.2s'
                                                        }} 
                                                    />
                                                    
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            background: snapshot.isDragging 
                                                                ? 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)'
                                                                : 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: snapshot.isDragging ? 'white' : 'primary.main',
                                                            flexShrink: 0,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Box>

                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: '1.05rem',
                                                            color: 'text.primary',
                                                            flex: 1
                                                        }}
                                                    >
                                                        {tercih}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>

                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 2,
                        color: 'text.secondary',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}
                >
                    💡 İpucu: Kartları tutup sürükleyerek sırayı değiştirebilirsiniz
                </Typography>
            </DialogContent>

            <DialogActions 
                sx={{ 
                    px: 3, 
                    py: 2.5, 
                    gap: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'grey.50'
                }}
            >
                <Button
                    onClick={onIptal}
                    variant="outlined"
                    size="large"
                    sx={{
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        px: 3,
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                            backgroundColor: 'grey.100'
                        }
                    }}
                >
                    İptal
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    size="large"
                    sx={{
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '1rem',
                        px: 4,
                        background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
                        boxShadow: '0 4px 12px rgba(30, 136, 229, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                            boxShadow: '0 6px 16px rgba(30, 136, 229, 0.4)',
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    Sıralamayı Onayla
                </Button>
            </DialogActions>
        </Dialog>
    );
}
