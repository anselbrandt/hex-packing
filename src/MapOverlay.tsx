import React from "react";

interface MapOverlayProps {}

export const MapOverlay: React.FC<MapOverlayProps> = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 10,
        top: "30px",
        marginLeft: "auto",
        marginRight: "auto",
        left: "0",
        right: "0",
        // textAlign: "center",
        padding: "1",
        fontSize: "1rem",
      }}
      // pointerEvents="none"
    >
      {children}
    </div>
  );
};
