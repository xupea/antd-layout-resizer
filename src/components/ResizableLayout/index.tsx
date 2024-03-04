import { RefObject, useEffect, useRef } from "react";
import { Layout } from "antd";
import {
  Subject,
  animationFrameScheduler,
  merge,
  observeOn,
  share,
} from "rxjs";

import ThemeContext, { ResizableProps } from "../../context/ResizableContext";
import type { ResizerAction } from "../Resizer";
import { SizeRelatedInfo, scanResizerAction } from "./operators";
import {
  calculateCoordinateOffset,
  collectSizeRelatedInfo,
  isDisabledResponsive,
  isSolid,
} from "./utils";
import { useResize } from "../../hooks/useResize";

export default function ResizableLayout({
  children,
  style,
  maxSize,
  minSize,
  defaultSize,
  vertical,
  size,
  disableResponsive,
}: ResizableProps) {
  const axis = vertical ? "y" : "x";
  const dimension = vertical ? "height" : "width";

  const childrenInstance = useRef<HTMLElement[]>([]);

  const childrenProps = useRef<Partial<ResizableProps>[]>([]);

  const resizerActions = useRef(new Subject<ResizerAction>());

  const sizeRelatedInfoAction = useRef(new Subject<SizeRelatedInfo>());

  const sizeRelatedInfo = useRef(
    merge(
      sizeRelatedInfoAction.current,
      resizerActions.current.pipe(
        scanResizerAction({
          calculateOffset: (current, original) =>
            calculateCoordinateOffset(current, original)[axis],
          getSizeRelatedInfo: () => makeSizeInfos(),
        })
      )
    ).pipe(observeOn(animationFrameScheduler), share())
  );

  /////////////////////////////////////////////

  const [ref] = useResize<HTMLElement>({
    maxSize,
    minSize,
    defaultSize,
    size,
    disableResponsive,
  });

  /////////////////////////////////////////////

  const populateInstance = (id: number, ref: RefObject<HTMLElement>) => {
    if (ref.current) {
      childrenInstance.current[id] = ref.current;
    }
  };

  const createID = (props: Partial<ResizableProps>) => {
    childrenProps.current.push(props);
    return childrenProps.current.length - 1;
  };

  const triggerAction = (action: ResizerAction) => {
    resizerActions.current.next(action);
  };

  const makeSizeInfos = () => {
    const { collect, getResult } = collectSizeRelatedInfo();
    childrenProps.current.forEach((childProps, index) => {
      const element = childrenInstance.current[index];

      collect({
        maxSize: childProps.maxSize,
        minSize: childProps.minSize,
        disableResponsive: isDisabledResponsive(childProps),
        isSolid: isSolid(childProps),
        currentSize: element.getBoundingClientRect()[dimension],
      });
    });

    return getResult();
  };

  useEffect(() => {
    sizeRelatedInfoAction.current.next(makeSizeInfos());
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        triggerAction,
        populateInstance,
        createID,
        sizeRelatedInfo: sizeRelatedInfo.current,
        vertical: !!vertical,
      }}
    >
      <Layout style={style} ref={ref}>
        {children}
      </Layout>
    </ThemeContext.Provider>
  );
}
