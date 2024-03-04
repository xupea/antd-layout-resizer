import { Layout } from "antd";

import { ResizableProps } from "../../context/ResizableContext";
import { useResize } from "../../hooks/useResize";
import "./index.css";

const { Header } = Layout;

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
    <Header className="unfixedHeader" style={style} ref={ref}>
      {children}
    </Header>
  );
}
