import type { Indicator } from './Indicator';

export interface ZoneModuleData {
  moduleId: string;
  moduleName: string;
  moduleWeight: number;
  indicators: Indicator[];
}

export interface Zone {
  id: string;
  name: string;
  municipality: string;
  center: [number, number];
  modules: ZoneModuleData[];
}
