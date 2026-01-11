# US-8.2 - Chart Drawing Tools

**Epic:** Advanced Trading Features  
**Phase:** Phase 8 - Enhanced Trading Experience  
**Status:** Deferred  
**Priority:** Low (due to implementation complexity)  
**Complexity:** High

> [!WARNING]
> **Implementation Note (2026-01-11)**: Initial implementation attempts encountered significant technical difficulties with `lightweight-charts` event propagation and custom overlay precision. This feature has been deferred to prioritize other core functionalities. Current status is "Research Only".

## User Story

As a **trader**  
I want to **draw trendlines, support/resistance zones, and annotations on charts**  
So that I can **perform technical analysis and mark important price levels**.

## Business Context

Professional traders need to:
- Identify trends visually with trendlines
- Mark support and resistance levels
- Add Fibonacci retracements for target levels
- Annotate charts with notes and observations
- Save drawings for future reference

This transforms the chart from a passive display to an active analysis tool.

## Acceptance Criteria

### 1. Drawing Toolbar

**Display:**
- [ ] Toolbar above chart with drawing tool icons
- [ ] Active tool highlighted
- [ ] Clear visual feedback for selected tool

**Tools:**
- [ ] **Trendline**: Draw diagonal lines
- [ ] **Horizontal Line**: Mark price levels
- [ ] **Vertical Line**: Mark time/events
- [ ] **Fibonacci Retracement**: Auto-calculate levels (23.6%, 38.2%, 50%, 61.8%, 100%)
- [ ] **Rectangle**: Mark support/resistance zones
- [ ] **Text Annotation**: Add notes
- [ ] **Delete**: Remove individual drawing
- [ ] **Clear All**: Remove all drawings

---

### 2. Trendline Tool

**Behavior:**
- [ ] Click to set start point
- [ ] Drag to set end point
- [ ] Line extends beyond endpoints
- [ ] Snaps to candle high/low (optional)

**Customization:**
- [ ] Color picker
- [ ] Line style (solid, dashed, dotted)
- [ ] Line width (1-5px)

---

### 3. Horizontal/Vertical Lines

**Horizontal Line:**
- [ ] Click to place at price level
- [ ] Extends across entire chart width
- [ ] Shows price label on right axis

**Vertical Line:**
- [ ] Click to place at time point
- [ ] Extends across entire chart height
- [ ] Shows date/time label on bottom axis

---

### 4. Fibonacci Retracement

**Behavior:**
- [ ] Click to set swing low
- [ ] Drag to set swing high
- [ ] Auto-draws 5 horizontal lines at:
  - 0% (swing low)
  - 23.6%
  - 38.2%
  - 50%
  - 61.8%
  - 100% (swing high)
- [ ] Each level labeled with percentage and price

**Visual:**
- [ ] Different color for each level
- [ ] Dashed lines
- [ ] Price labels on right

---

### 5. Rectangle (Zone) Tool

**Behavior:**
- [ ] Click and drag to create rectangle
- [ ] Represents support/resistance zone
- [ ] Semi-transparent fill
- [ ] Solid border

**Use Cases:**
- Support zones (green)
- Resistance zones (red)
- Consolidation areas (yellow)

---

### 6. Text Annotation

**Behavior:**
- [ ] Click to place annotation
- [ ] Text input dialog appears
- [ ] Enter note/observation
- [ ] Positioned at clicked price/time

**Features:**
- [ ] Editable (double-click)
- [ ] Draggable
- [ ] Font size options
- [ ] Background color

---

### 7. Drawing Management

**Edit Mode:**
- [ ] Click drawing to select
- [ ] Drag to move
- [ ] Resize handles for rectangles/Fibonacci
- [ ] Delete button appears

**Persistence:**
- [ ] Drawings saved to localStorage
- [ ] Keyed by instrumentId
- [ ] Restored on page load
- [ ] Survive page refresh

**Clear All:**
- [ ] Confirmation dialog
- [ ] Removes all drawings for current instrument

---

### 8. Chart Interaction

**Pan/Zoom:**
- [ ] Drawings move with chart
- [ ] Drawings scale with zoom
- [ ] Maintain relative positions

**Drawing Mode:**
- [ ] When tool selected, chart pan disabled
- [ ] After drawing, auto-return to pan mode
- [ ] ESC key cancels current drawing

---

## Technical Requirements

### Technology Stack

**Approach**: Custom Canvas Overlay on Lightweight Charts

**Why**:
- Lightweight Charts doesn't support native drawings
- TradingView library is expensive ($3000/year)
- Canvas overlay provides full control
- Can sync with chart pan/zoom

---

### Architecture

#### Drawing Store
**File**: `frontend/src/features/market/store/chartDrawingStore.ts`

```tsx
interface Drawing {
  id: string;
  type: 'trendline' | 'horizontal' | 'vertical' | 'fibonacci' | 'rectangle' | 'text';
  points: { time: number; price: number }[];
  style: {
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed' | 'dotted';
    fillColor?: string;
    fillOpacity?: number;
  };
  text?: string;
  fibLevels?: number[]; // For Fibonacci
}

interface ChartDrawingState {
  drawings: Map<string, Drawing[]>; // instrumentId -> drawings
  activeDrawingType: DrawingType | null;
  selectedDrawingId: string | null;
  
  addDrawing: (instrumentId: string, drawing: Drawing) => void;
  updateDrawing: (instrumentId: string, id: string, updates: Partial<Drawing>) => void;
  removeDrawing: (instrumentId: string, id: string) => void;
  clearAll: (instrumentId: string) => void;
  setActiveDrawingType: (type: DrawingType | null) => void;
  selectDrawing: (id: string | null) => void;
  
  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}
```

---

#### Canvas Overlay Component
**File**: `frontend/src/features/market/components/ChartCanvas.tsx`

```tsx
interface ChartCanvasProps {
  chartRef: React.RefObject<IChartApi>;
  instrumentId: string;
  width: number;
  height: number;
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
  chartRef,
  instrumentId,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { drawings, activeDrawingType, addDrawing } = useChartDrawingStore();
  
  // Mouse event handlers
  const handleMouseDown = (e: MouseEvent) => {
    const { time, price } = getChartCoordinates(e);
    // Start drawing based on activeDrawingType
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    // Update preview of current drawing
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    // Finalize drawing
    // Add to store
  };
  
  // Render drawings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw all drawings
    const instrumentDrawings = drawings.get(instrumentId) || [];
    instrumentDrawings.forEach(drawing => {
      renderDrawing(ctx, drawing, chartRef.current);
    });
  }, [drawings, instrumentId, width, height]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: activeDrawingType ? 'auto' : 'none',
        cursor: activeDrawingType ? 'crosshair' : 'default'
      }}
    />
  );
};
```

---

#### Drawing Toolbar Component
**File**: `frontend/src/features/market/components/ChartDrawingToolbar.tsx`

```tsx
export const ChartDrawingToolbar = () => {
  const { activeDrawingType, setActiveDrawingType, clearAll } = useChartDrawingStore();
  
  const tools = [
    { type: 'trendline', icon: <TrendingUpIcon />, label: 'Trendline' },
    { type: 'horizontal', icon: <HorizontalRuleIcon />, label: 'Horizontal Line' },
    { type: 'vertical', icon: <VerticalAlignCenterIcon />, label: 'Vertical Line' },
    { type: 'fibonacci', icon: <TimelineIcon />, label: 'Fibonacci' },
    { type: 'rectangle', icon: <CropSquareIcon />, label: 'Rectangle' },
    { type: 'text', icon: <TextFieldsIcon />, label: 'Text' },
  ];
  
  return (
    <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: 1, borderColor: 'divider' }}>
      {tools.map(tool => (
        <Tooltip key={tool.type} title={tool.label}>
          <IconButton
            size="small"
            color={activeDrawingType === tool.type ? 'primary' : 'default'}
            onClick={() => setActiveDrawingType(tool.type as DrawingType)}
          >
            {tool.icon}
          </IconButton>
        </Tooltip>
      ))}
      
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      
      <Tooltip title="Clear All">
        <IconButton size="small" onClick={() => clearAll(instrumentId)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
```

---

### Coordinate Conversion

**Challenge**: Convert between canvas pixels and chart price/time

```tsx
const getChartCoordinates = (
  mouseEvent: MouseEvent,
  chartApi: IChartApi
): { time: number; price: number } => {
  const rect = canvas.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  
  // Convert pixel to chart coordinates
  const timeScale = chartApi.timeScale();
  const priceScale = chartApi.priceScale('right');
  
  const time = timeScale.coordinateToTime(x);
  const price = priceScale.coordinateToPrice(y);
  
  return { time, price };
};

const getCanvasCoordinates = (
  time: number,
  price: number,
  chartApi: IChartApi
): { x: number; y: number } => {
  const timeScale = chartApi.timeScale();
  const priceScale = chartApi.priceScale('right');
  
  const x = timeScale.timeToCoordinate(time);
  const y = priceScale.priceToCoordinate(price);
  
  return { x, y };
};
```

---

## Implementation Steps

### Phase 1: Foundation (3 hours)
1. Create chartDrawingStore with Zustand
2. Create ChartCanvas component
3. Implement coordinate conversion
4. Add canvas overlay to StockChart
5. Test basic click/drag detection

### Phase 2: Drawing Tools (5 hours)
1. Implement Trendline tool
2. Implement Horizontal/Vertical lines
3. Implement Fibonacci retracement
4. Implement Rectangle tool
5. Implement Text annotation

### Phase 3: Editing & Persistence (2 hours)
1. Add selection/edit mode
2. Add delete functionality
3. Implement localStorage persistence
4. Add clear all with confirmation

**Total: 10 hours**

---

## Success Metrics

- [ ] All 6 drawing tools functional
- [ ] Drawings persist across page refresh
- [ ] Drawings sync with chart pan/zoom
- [ ] No performance lag with 10+ drawings
- [ ] Intuitive UX (minimal clicks to draw)

---

## Dependencies

**Required:**
- ✅ US-2.3.1: Live Stock Charts (Lightweight Charts)

---

## Non-Goals

- ❌ Cloud sync (drawings only in localStorage)
- ❌ Sharing drawings with other users
- ❌ Advanced shapes (triangles, channels)
- ❌ Drawing templates
- ❌ Undo/redo (future enhancement)
