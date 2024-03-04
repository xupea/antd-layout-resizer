import { Layout } from "antd";

import { ResizableProps } from "../../context/ResizableContext";
import { useResize } from "../../hooks/useResize";
import "./index.css";

const { Content } = Layout;

export default function ResizableContent({
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
    <Content className="unfixedContent" style={style} ref={ref}>
      {children}
    </Content>
  );
}
