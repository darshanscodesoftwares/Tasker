import { useState, useCallback, useRef } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import LinkInputWidget from "./LinkInputWidget";
import SummaryWidget from "./SummaryWidget";
import HistoryWidget from "./HistoryWidget";

const LAYOUT_KEY = "tasker-widget-layout";

// Default layouts per breakpoint
const defaultLayouts = {
  lg: [
    { i: "link", x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: "summary", x: 4, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: "history", x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
  ],
  md: [
    { i: "link", x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 4 },
    { i: "summary", x: 6, y: 0, w: 6, h: 5, minW: 3, minH: 4 },
    { i: "history", x: 0, y: 5, w: 12, h: 4, minW: 3, minH: 3 },
  ],
  sm: [
    { i: "link", x: 0, y: 0, w: 12, h: 4, minW: 3, minH: 3 },
    { i: "summary", x: 0, y: 4, w: 12, h: 5, minW: 3, minH: 4 },
    { i: "history", x: 0, y: 9, w: 12, h: 4, minW: 3, minH: 3 },
  ],
};

function loadLayouts() {
  try {
    const stored = localStorage.getItem(LAYOUT_KEY);
    return stored ? JSON.parse(stored) : defaultLayouts;
  } catch {
    return defaultLayouts;
  }
}

export default function Workspace({
  onGenerate,
  isLoading,
  summary,
  onSave,
  isSaving,
  summaries,
  onSelectHistory,
}) {
  const [layouts, setLayouts] = useState(loadLayouts);
  const containerRef = useRef(null);
  const width = useContainerWidth(containerRef);

  const handleLayoutChange = useCallback((_layout, allLayouts) => {
    setLayouts(allLayouts);
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(allLayouts));
    } catch {
      // localStorage might be full — ignore
    }
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-7xl">
      {width > 0 && (
        <ResponsiveGridLayout
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1024, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 12, sm: 12 }}
          rowHeight={60}
          margin={[16, 16]}
          containerPadding={[16, 0]}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-drag-handle"
          useCSSTransforms
        >
          <div key="link">
            <WidgetWrapper>
              <LinkInputWidget onGenerate={onGenerate} isLoading={isLoading} />
            </WidgetWrapper>
          </div>
          <div key="summary">
            <WidgetWrapper>
              <SummaryWidget
                summary={summary}
                onSave={onSave}
                isSaving={isSaving}
              />
            </WidgetWrapper>
          </div>
          <div key="history">
            <WidgetWrapper>
              <HistoryWidget summaries={summaries} onSelect={onSelectHistory} />
            </WidgetWrapper>
          </div>
        </ResponsiveGridLayout>
      )}
    </div>
  );
}

/**
 * Wrapper that adds a drag handle and fills the grid cell.
 */
function WidgetWrapper({ children }) {
  return (
    <div className="h-full flex flex-col">
      {/* Drag handle at the top */}
      <div className="widget-drag-handle h-3 cursor-grab active:cursor-grabbing flex items-center justify-center">
        <div className="w-8 h-1 rounded-full bg-white/10" />
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
