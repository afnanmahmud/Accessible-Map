// src/components/AccessibleMap/types.ts
import { OSM, XYZ } from 'ol/source';

export interface LayerProps {
  source: OSM | XYZ;
  visible: boolean;
  title: string;
  maxZoom?: number;
}

export type MapViewType = 'standard' | 'satellite';

export interface AccessibleMapProps {
  className?: string;
}