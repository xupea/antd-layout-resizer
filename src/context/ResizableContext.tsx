import {
  CSSProperties,
  PropsWithChildren,
  RefObject,
  createContext,
} from "react";
import { EMPTY, Observable } from "rxjs";
import type { ResizerAction } from "../components/Resizer";
import type { SizeRelatedInfo } from "../components/ResizableLayout/operators";

export interface ResizableProps extends PropsWithChildren {
  style: CSSProperties;
  /**
   * 固定尺寸，将会忽略其它
   */
  size?: number;
  /**
   * 最大尺寸
   */
  maxSize?: number;
  /**
   * 最小尺寸
   */
  minSize?: number;
  /**
   * 初始尺寸
   */
  defaultSize?: number;
  /**
   * 是否响应式
   */
  disableResponsive?: boolean;
  /**
   * TODO
   */
  vertical?: boolean;
}

export interface ThemeContextData {
  triggerAction: (action: ResizerAction) => void;
  createID: (props: Partial<ResizableProps>) => number;
  populateInstance: (id: number, ref: RefObject<HTMLElement>) => void;
  sizeRelatedInfo: Observable<SizeRelatedInfo>;
  vertical: boolean;
}

const ThemeContext = createContext<ThemeContextData>({
  triggerAction: () => {},
  populateInstance: () => {},
  createID: (props: Partial<ResizableProps>) => {
    return props.defaultSize ?? 0;
  },
  sizeRelatedInfo: EMPTY,
  vertical: false,
});

export default ThemeContext;
