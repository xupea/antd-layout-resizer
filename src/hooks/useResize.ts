import { useContext, useEffect, useRef } from "react";
import ThemeContext from "../context/ResizableContext";
import { Subscription, filter, map, tap } from "rxjs";
import { SizeInfo } from "../components/ResizableLayout/operators";
import { isValidNumber } from "../components/ResizableLayout/utils";

export function useResize<T extends HTMLElement>({
  maxSize,
  minSize,
  defaultSize,
  size,
  disableResponsive,
}) {
  const ref = useRef<T>(null);

  const theme = useContext(ThemeContext);

  const id = useRef(
    theme.createID({ maxSize, minSize, defaultSize, disableResponsive, size })
  );

  const subscription = useRef(new Subscription());
  const sizeInfoRef = useRef<SizeInfo>();
  const flexGrowRatioRef = useRef(0);

  const getFlexShrink = () => {
    if (isValidNumber(size)) {
      return 0;
    } else {
      return disableResponsive ? 1 : 0;
    }
  };

  const getStyle = (sizeInfo: SizeInfo, flexGrowRatio: number) => {
    const flexShrink = getFlexShrink();

    if (sizeInfo) {
      const { disableResponsive, currentSize } = sizeInfo;

      return {
        flexShrink,
        flexGrow: disableResponsive ? 0 : flexGrowRatio * currentSize,
        flexBasis: disableResponsive ? currentSize : 0,
      };
    } else {
      const newSize = size || defaultSize;

      if (isValidNumber(newSize)) {
        return {
          flexShrink,
          flexGrow: 0,
          flexBasis: newSize,
        };
      } else {
        return {
          flexShrink,
          flexGrow: 1,
          flexBasis: 0,
        };
      }
    }
  };

  const resize = useRef(
    theme.sizeRelatedInfo.pipe(
      map(({ sizeInfoArray, flexGrowRatio }) => ({
        sizeInfo: sizeInfoArray[id.current],
        flexGrowRatio,
      })),
      filter(({ sizeInfo }) => !!sizeInfo),
      tap(({ sizeInfo, flexGrowRatio }) => {
        sizeInfoRef.current = sizeInfo;
        flexGrowRatioRef.current = flexGrowRatio;

        if (ref.current) {
          const { flexGrow, flexShrink, flexBasis } = getStyle(
            sizeInfo,
            flexGrowRatio
          );

          ref.current.style.flexGrow = `${flexGrow}`;
          ref.current.style.flexShrink = `${flexShrink}`;
          ref.current.style.flexBasis = `${flexBasis}px`;

          if (theme.vertical) {
            ref.current.style.maxHeight = `${maxSize}px`;
            ref.current.style.minHeight = `${minSize}px`;
          } else {
            ref.current.style.maxWidth = `${maxSize}px`;
            ref.current.style.minWidth = `${minSize}px`;
          }
        }
      })
    )
  );

  useEffect(() => {
    const subscriptionRef = subscription.current;
    subscriptionRef.add(resize.current.subscribe());
    theme.populateInstance(id.current, ref);

    return () => {
      subscriptionRef.unsubscribe();
    };
  }, [theme, maxSize, minSize, defaultSize]);

  return [ref];
}
