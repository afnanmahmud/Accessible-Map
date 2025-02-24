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

export interface PageTitleProps {
  title: string;
}
export interface MapSearchProps { }
export interface NavButtonGroupProps { }
export interface AccountFormProps { }
export interface AccountPreferencesAndInfoProps { }
export interface AccoundFieldProps {
  fieldName: string;
  hidden: boolean;
}
export interface AccountIconAndNameProps {
  src?: string;
  userName: string;
}
export interface IconButtonProps {
  src?: string;
  route: string;
  style?: React.CSSProperties;
}
export interface NavButtonProps {
  route: string;
  title: string;
  style?: React.CSSProperties;
}
export interface MapSearchInputProps {
  placeholder: string;
  location: string;
  setLocation: (val: string) => void;
}