import { useEffect } from 'react';

interface NavigationHandlers {
    onBuy: (id: string) => void;
    onSell: (id: string) => void;
    onChart: (id: string) => void;
    setSelectedRowId: (id: string) => void;
    setHoveredRowId: (id: string) => void;
}

export const useWatchlistKeyboardNavigation = (
    watchlistInstruments: any[],
    activeRowId: string | null,
    handlers: NavigationHandlers
) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeRowId || watchlistInstruments.length === 0) return;

            const currentIndex = watchlistInstruments.findIndex(inst => inst!.id === activeRowId);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < watchlistInstruments.length - 1) {
                        const nextId = watchlistInstruments[currentIndex + 1]!.id;
                        handlers.setSelectedRowId(nextId);
                        handlers.setHoveredRowId(nextId);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        const prevId = watchlistInstruments[currentIndex - 1]!.id;
                        handlers.setSelectedRowId(prevId);
                        handlers.setHoveredRowId(prevId);
                    }
                    break;
                case 'b': case 'B':
                    e.preventDefault(); handlers.onBuy(activeRowId); break;
                case 's': case 'S':
                    e.preventDefault(); handlers.onSell(activeRowId); break;
                case 'c': case 'C':
                case 'Enter':
                    e.preventDefault(); handlers.onChart(activeRowId); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeRowId, watchlistInstruments, handlers]);
};
