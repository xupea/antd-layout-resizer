import { Layout } from "antd";

import { ResizableProps } from "../../context/ResizableContext";
import { useResize } from "../../hooks/useResize";
import "./index.css";

const { Footer } = Layout;

export default function ResizableFooter({
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
    <Footer className="unfixedFooter" style={style} ref={ref}>
      {children}
    </Footer>
  );
}
