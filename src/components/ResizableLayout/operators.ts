/* eslint-disable no-case-declarations */
import { scan } from "rxjs";
import { ResizerAction, Coordinate, ResizerActionType } from "../Resizer";
import { getNextSizeRelatedInfo } from "./utils";

export interface SizeInfo {
  isSolid: boolean;
  currentSize: number;
  maxSize?: number;
  minSize?: number;
  disableResponsive?: boolean;
}

export interface SizeRelatedInfo {
  discard?: boolean;
  sizeInfoArray: SizeInfo[];
  flexGrowRatio: number;
}

interface ScanBarActionConfig {
  getSizeRelatedInfo: () => SizeRelatedInfo;
  calculateOffset: (current: Coordinate, original: Coordinate) => number;
}

export interface BarActionScanResult extends SizeRelatedInfo {
  barID: number;
  offset: number;
  type: ResizerActionType;
  originalCoordinate: Coordinate;
  defaultSizeInfoArray: SizeInfo[];
}

const DEFAULT_COORDINATE_OFFSET: Coordinate = { x: 0, y: 0 };

const DEFAULT_BAR_ACTION_SCAN_RESULT: BarActionScanResult = {
  barID: -1,
  offset: 0,
  type: ResizerActionType.DEACTIVATE,
  originalCoordinate: DEFAULT_COORDINATE_OFFSET,
  defaultSizeInfoArray: [],
  sizeInfoArray: [],
  discard: true,
  flexGrowRatio: 0,
};

export function scanResizerAction(config: ScanBarActionConfig) {
  return scan<ResizerAction, BarActionScanResult>((prevResult, action) => {
    const result = {
      barID: action.barID,
      type: action.type,
    };

    switch (action.type) {
      case ResizerActionType.ACTIVATE:
        const { sizeInfoArray, flexGrowRatio } = config.getSizeRelatedInfo();

        return {
          ...DEFAULT_BAR_ACTION_SCAN_RESULT,
          ...result,
          originalCoordinate: action.coordinate,
          defaultSizeInfoArray: sizeInfoArray,
          sizeInfoArray,
          flexGrowRatio,
        };
      case ResizerActionType.MOVE:
        const offset = config.calculateOffset(
          action.coordinate,
          prevResult.originalCoordinate
        );

        return {
          ...result,
          ...getNextSizeRelatedInfo(
            action.barID,
            offset,
            prevResult.defaultSizeInfoArray
          ),
          offset,
          originalCoordinate: prevResult.originalCoordinate,
          defaultSizeInfoArray: prevResult.defaultSizeInfoArray,
          discard: false,
        };
      case ResizerActionType.DEACTIVATE:
        return DEFAULT_BAR_ACTION_SCAN_RESULT;
    }
  }, DEFAULT_BAR_ACTION_SCAN_RESULT);
}
