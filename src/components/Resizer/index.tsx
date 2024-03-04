import { useContext, useEffect, useRef } from "react";
import ThemeContext from "../../context/ResizableContext";
import "./index.css";

interface ResizerProps {
  size?: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export enum ResizerActionType {
  ACTIVATE = "activate",
  MOVE = "move",
  DEACTIVATE = "deactivate",
}

export interface ResizerAction {
  type: ResizerActionType;
  coordinate: Coordinate;
  barID: number;
}

export default function Resizer({ size }: ResizerProps) {
  const theme = useContext(ThemeContext);
  const id = useRef(theme.createID({ size }));

  const ref = useRef<HTMLDivElement>(null);
  const isActivated = useRef(false);

  const onStatusChanged = (value: boolean) => {
    if (isActivated.current !== value) {
      isActivated.current = value;
    }
  };

  const updateStatusIfNeed = (type: ResizerActionType) => {
    if (type === ResizerActionType.ACTIVATE) {
      onStatusChanged(true);
    } else if (type === ResizerActionType.DEACTIVATE) {
      onStatusChanged(false);
    }
  };

  const triggerAction = (type: ResizerActionType, coordinate: Coordinate) => {
    if (isActivated.current || type === ResizerActionType.ACTIVATE) {
      theme.triggerAction({ type, coordinate, barID: id.current });
    }

    if (isActivated.current && type === ResizerActionType.DEACTIVATE) {
      // touch and click
      // onClick();
    }

    updateStatusIfNeed(type);
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    const { clientX: x, clientY: y } = event;
    triggerAction(ResizerActionType.MOVE, { x, y });
  };
  const onMouseUp = (event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    triggerAction(ResizerActionType.DEACTIVATE, { x, y });
  };
  const onMouseDown = (event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    triggerAction(ResizerActionType.ACTIVATE, { x, y });
  };

  useEffect(() => {
    theme.populateInstance(id.current, ref);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    const resizer = ref.current;
    resizer?.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      resizer?.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div
      className={theme.vertical ? "vertical" : "horizontal"}
      style={
        theme.vertical
          ? { height: size, minHeight: size }
          : { width: size, minWidth: size }
      }
      ref={ref}
    ></div>
  );
}
