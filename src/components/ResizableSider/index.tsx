import { Layout } from "antd";

import { ResizableProps } from "../../context/ResizableContext";
import { useResize } from "../../hooks/useResize";
import './index.css';

const { Sider } = Layout;

export default function ResizableSider({
  children,
  style,
  maxSize,
  minSize,
  defaultSize,
  disableResponsive,
  size,
}: ResizableProps) {
  const [ref] = useResize<HTMLDivElement>({
    maxSize,
    minSize,
    defaultSize,
    disableResponsive,
    size,
  });

  return (
    <Sider className="unfixedSider" width={defaultSize} style={style} ref={ref}>
      {children}
    </Sider>
  );
}
