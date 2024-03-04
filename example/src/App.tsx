import React from "react";
import {
  ResizableLayout,
  ResizableSider,
  ResizableContent,
  ResizableHeader,
  ResizableFooter,
  Resizer,
} from "antd-layout-resizer";

import "./App.css";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  paddingInline: 48,
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#0958d9",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "130px",
  color: "#fff",
  backgroundColor: "#1677ff",
  transition: "none",
  fontSize: 20
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "100%",
  height: "100%",
};

function App() {
  return (
    <ResizableLayout style={layoutStyle}>
      <ResizableSider
        disableResponsive
        minSize={100}
        maxSize={400}
        defaultSize={300}
        style={siderStyle}
      >
        Sider
      </ResizableSider>
      <Resizer size={8} />
      <ResizableLayout vertical style={layoutStyle}>
        <ResizableHeader size={100} style={headerStyle}>
          Header
        </ResizableHeader>
        <ResizableContent style={contentStyle}>Content</ResizableContent>
        <Resizer size={8} />
        <ResizableFooter
          disableResponsive
          defaultSize={200}
          style={footerStyle}
        >
          Footer
        </ResizableFooter>
      </ResizableLayout>
    </ResizableLayout>
  );
}

export default App;
