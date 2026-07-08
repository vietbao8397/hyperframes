// @vitest-environment happy-dom

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TimelineElement } from "../store/playerStore";
import { usePlayerStore } from "../store/playerStore";
import { TRACK_H } from "./timelineLayout";
import { buildStackingTimelineLayers } from "./timelineTrackOrder";
import type { DraggedClipState } from "./useTimelineClipDrag";
import { useTimelineClipDrag } from "./useTimelineClipDrag";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function timelineElement(input: { id: string; track: number; zIndex: number }): TimelineElement {
  return {
    id: input.id,
    domId: input.id,
    tag: "div",
    start: 0,
    duration: 2,
    track: input.track,
    zIndex: input.zIndex,
    stackingContextId: "root",
    parentCompositionId: null,
    compositionAncestors: ["root"],
    sourceFile: "index.html",
    timingSource: "authored",
  };
}

afterEach(() => {
  document.body.innerHTML = "";
  usePlayerStore.getState().reset();
});

function renderDragHarness(elements: TimelineElement[]) {
  const layers = buildStackingTimelineLayers(elements).rows;
  const scroll = document.createElement("div");
  document.body.append(scroll);
  const onMoveElement = vi.fn();
  let setDraggedClip: ((state: DraggedClipState | null) => void) | null = null;

  function Harness() {
    const hook = useTimelineClipDrag({
      scrollRef: { current: scroll },
      ppsRef: { current: 100 },
      durationRef: { current: 10 },
      trackOrderRef: { current: layers.map((layer) => layer.id) },
      timelineLayersRef: { current: layers },
      timelineElementsRef: { current: elements },
      onMoveElement,
      onResizeElement: vi.fn(),
      onBlockedEditAttempt: vi.fn(),
      setShowPopover: vi.fn(),
      setRangeSelectionRef: { current: vi.fn() },
    });
    setDraggedClip = hook.setDraggedClip;
    return null;
  }

  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  act(() => {
    root.render(<Harness />);
  });
  if (!setDraggedClip) throw new Error("Expected drag setter");
  const applyDraggedClip: (state: DraggedClipState | null) => void = setDraggedClip;

  return {
    layers,
    onMoveElement,
    startDrag(element: TimelineElement, layerIndex: number) {
      act(() => {
        applyDraggedClip({
          element,
          originClientX: 0,
          originClientY: 0,
          originScrollLeft: 0,
          originScrollTop: 0,
          pointerClientX: 0,
          pointerClientY: 0,
          pointerOffsetX: 0,
          pointerOffsetY: 0,
          previewStart: element.start,
          previewTrack: element.track,
          previewLayerId: layers[layerIndex]!.id,
          previewLayerIndex: layerIndex,
          previewStackingReorder: null,
          snapBeatTime: null,
          started: false,
        });
      });
    },
    movePointer(clientX: number, clientY: number) {
      act(() => {
        window.dispatchEvent(
          new MouseEvent("pointermove", {
            bubbles: true,
            clientX,
            clientY,
          }),
        );
      });
    },
    async dropPointer() {
      await act(async () => {
        window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
      });
    },
    unmount() {
      act(() => root.unmount());
    },
  };
}

describe("useTimelineClipDrag", () => {
  it("passes a new-lane stacking intent when a vertical drag targets an overlapping lane", async () => {
    const front = timelineElement({ id: "front", track: 0, zIndex: 3 });
    const middle = timelineElement({ id: "middle", track: 1, zIndex: 2 });
    const back = timelineElement({ id: "back", track: 2, zIndex: 1 });
    const harness = renderDragHarness([front, middle, back]);

    harness.startDrag(back, 2);
    harness.movePointer(0, -2 * TRACK_H);
    await harness.dropPointer();

    expect(harness.onMoveElement).toHaveBeenCalledTimes(1);
    expect(harness.onMoveElement.mock.calls[0]![1]).toMatchObject({
      start: 0,
      track: 2,
      stackingReorder: {
        contextKey: "root",
        placement: { type: "above", layerId: harness.layers[0]!.id },
        zIndexChanges: [{ key: "back", zIndex: 4 }],
      },
    });

    harness.unmount();
  });

  it("uses the preview start when resolving whether a dragged clip can join a lane", async () => {
    const front = timelineElement({ id: "front", track: 0, zIndex: 3 });
    const back = timelineElement({ id: "back", track: 1, zIndex: 1 });
    back.start = 0;
    front.start = 0;
    const harness = renderDragHarness([front, back]);

    harness.startDrag(back, 1);
    harness.movePointer(200, -TRACK_H);
    await harness.dropPointer();

    expect(harness.onMoveElement).toHaveBeenCalledTimes(1);
    expect(harness.onMoveElement.mock.calls[0]![1]).toMatchObject({
      start: 2,
      track: 1,
      stackingReorder: {
        contextKey: "root",
        placement: { type: "onto", layerId: harness.layers[0]!.id },
        zIndexChanges: [{ key: "back", zIndex: 3 }],
      },
    });

    harness.unmount();
  });
});
