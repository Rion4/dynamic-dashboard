"use client";

import type React from "react";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { WidgetSidebar } from "@/components/widget-sidebar";
import { WIDGET_DEFAULT_SIZES, DEFAULT_SIZE } from "@/lib/widget-sizes";

export default function Home() {
  const [widgets, setWidgets] = useState<Array<{ id: string; type: string }>>(
    []
  );
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [widgetSizes, setWidgetSizes] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const [widgetPositions, setWidgetPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [minWidgetSize, setMinWidgetSize] = useState(300);

  const handleDragStart = (type: string, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("widgetType", type);
    setDraggedWidget(type);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleDropOnCanvas = (e: React.DragEvent, dropX: number, dropY: number) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType");
    if (widgetType) {
      const newWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
      };
      const widgetSize = WIDGET_DEFAULT_SIZES[widgetType] || DEFAULT_SIZE;
      
      // Calculate position centered at drop point, with bounds checking
      const canvasPadding = 32; // canvas has p-8 = 32px padding
      const minX = canvasPadding;
      const minY = canvasPadding;
      
      let x = dropX - widgetSize.width / 2;
      let y = dropY - widgetSize.height / 2;
      
      // Ensure widget doesn't go outside canvas bounds
      x = Math.max(minX, x);
      y = Math.max(minY, y);
      
      setWidgets([...widgets, newWidget]);
      setWidgetSizes((prev) => ({
        ...prev,
        [newWidget.id]: widgetSize,
      }));
      setWidgetPositions((prev) => ({
        ...prev,
        [newWidget.id]: { x, y },
      }));
      setDraggedWidget(null);
    }
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
    setWidgetSizes((prev) => {
      const newSizes = { ...prev };
      delete newSizes[id];
      return newSizes;
    });
    setWidgetPositions((prev) => {
      const newPositions = { ...prev };
      delete newPositions[id];
      return newPositions;
    });
  };
  const handleMoveWidget = (id: string, x: number, y: number) => {
    setWidgetPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  };

  const handleResizeWidget = (id: string, width: number, height: number) => {
    setWidgetSizes((prev) => ({
      ...prev,
      [id]: { width: Math.max(minWidgetSize, width), height: Math.max(minWidgetSize, height) },
    }));
  };

  // Arrange widgets in a grid layout
  const arrangeWidgets = () => {
    const gap = 24;
    const startX = 40;
    const startY = 40;
    
    // Calculate available width based on viewport
    // Account for sidebar (~280px), padding (32px total), scrollbar (0-20px)
    const sidebarWidth = 280;
    const padding = 64; // 32px per side for canvas padding
    const safeMargin = 20;
    const availableWidth = window.innerWidth - sidebarWidth - padding - safeMargin;
    
    // Calculate positions based on widget sizes
    let currentX = startX;
    let currentY = startY;
    let maxHeightInRow = 0;
    
    // Arrange positions and reset sizes
    const newPositions: Record<string, { x: number; y: number }> = {};
    const newSizes: Record<string, { width: number; height: number }> = {};
    
    widgets.forEach((widget, idx) => {
      const defaultSize = WIDGET_DEFAULT_SIZES[widget.type] || DEFAULT_SIZE;
      
      // Update widget size to its default
      newSizes[widget.id] = defaultSize;
      
      // Check if this widget fits in the current row
      if (currentX > startX && currentX + defaultSize.width > availableWidth) {
        // Wrap to next row
        currentX = startX;
        currentY += maxHeightInRow + gap;
        maxHeightInRow = 0;
      }
      
      // Calculate position
      newPositions[widget.id] = { x: currentX, y: currentY };
      
      // Track the tallest widget in this row
      if (defaultSize.height > maxHeightInRow) {
        maxHeightInRow = defaultSize.height;
      }
      
      // Move to next position
      currentX += defaultSize.width + gap;
    });
    
    setWidgetPositions(() => newPositions);
    setWidgetSizes(() => newSizes);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="flex h-screen">
        <WidgetSidebar
          onDragStart={handleDragStart}
          draggedWidget={draggedWidget}
        />
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex gap-2">
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/80 transition"
              onClick={arrangeWidgets}
              disabled={widgets.length === 0}
            >
              Arrange Widgets
            </button>
          </div>
          {/* Main dashboard area */}
          <Dashboard
            widgets={widgets}
            onRemoveWidget={removeWidget}
            onDropOnCanvas={handleDropOnCanvas}
            onDragEnd={handleDragEnd}
            draggedWidget={draggedWidget}
            widgetSizes={widgetSizes}
            widgetPositions={widgetPositions}
            onResizeWidget={handleResizeWidget}
            onMoveWidget={handleMoveWidget}
          />
        </div>
      </div>
    </div>
  );
}
