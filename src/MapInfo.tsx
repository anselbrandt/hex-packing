import React from "react";

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
  transitionInterpolator?: any;
}

interface MapInfoProps {
  viewState: ViewState;
}

export const MapInfo: React.FC<MapInfoProps> = ({ viewState }) => {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 10,
        top: "10px",
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
      {`${viewState.latitude.toFixed(3)}, ${viewState.longitude.toFixed(
        3
      )} ${viewState.zoom.toFixed(1)}x ${viewState.bearing.toFixed(1)}°`}
    </div>
  );
};
