import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, PathLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { montreal } from "./montreal";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import box from "@turf/bbox";
import poly from "@turf/bbox-polygon";
import hex from "@turf/hex-grid";
import { MapInfo } from "./MapInfo";
import { MapOverlay } from "./MapOverlay";
import center from "@turf/center";
import pointInPoly from "@turf/boolean-point-in-polygon";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

interface Props {}

export const Map: React.FC<Props> = () => {
  const INITIAL_VIEW_STATE = {
    longitude: -73.75,
    latitude: 45.555,
    zoom: 10.5,
    pitch: 0,
    // bearing: -57.5,
    bearing: 0,
  };
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const handleChangeViewState = ({ viewState }: any) => setViewState(viewState);

  const bbox = box(montreal);
  const polygon = poly(bbox);
  const cellSide = 1.9;
  const options = { units: "kilometers" };
  const hexgrid = hex(bbox, cellSide, options);

  const island = montreal.features[0].geometry;
  const filtered = hexgrid.features.filter((cell: any) => {
    const point = center(cell);
    const isOnIsland = pointInPoly(point, island);
    return isOnIsland;
  });
  const centers = filtered.map((feature: any) => center(feature));

  const cells = filtered.length;

  const path = [
    {
      path: [
        [-73.964792, 45.413806],
        [-73.587076, 45.503546],
        [-73.48159, 45.701829],
      ],
      name: "Montreal",
    },
  ];
  const layers = [
    new PathLayer({
      id: "path-layer",
      visible: false,
      data: path,
      pickable: true,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: (d: any) => d.path,
      getColor: (d) => [70, 130, 180],
      getWidth: (d) => 5,
    }),
    new GeoJsonLayer({
      id: "geojson-layer",
      data: montreal as any,
      pickable: true,
      stroked: true,
      filled: false,
      extruded: false,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (d) => [70, 130, 180],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
    }),
    new GeoJsonLayer({
      id: "bbox-layer",
      visible: false,
      data: polygon as any,
      pickable: true,
      stroked: true,
      filled: false,
      extruded: false,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (d) => [70, 130, 180],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
    }),
    new GeoJsonLayer({
      id: "hexgrid-layer",
      visible: true,
      data: filtered as any,
      pickable: true,
      stroked: true,
      filled: false,
      extruded: false,
      lineWidthScale: 20,
      lineWidthMinPixels: 1,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (d) => [255, 99, 71],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
    }),
    new GeoJsonLayer({
      id: "centers-layer",
      visible: true,
      data: centers as any,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthScale: 5,
      lineWidthMinPixels: 1,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (d) => [255, 99, 71],
      getRadius: 25,
      getLineWidth: 1,
      getElevation: 30,
    }),
  ];
  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={handleChangeViewState}
      controller={true}
      layers={layers}
    >
      <StaticMap
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      />
      <MapInfo viewState={viewState} />
      <MapOverlay>
        <div>{`${cells} cells`}</div>
      </MapOverlay>
    </DeckGL>
  );
};
