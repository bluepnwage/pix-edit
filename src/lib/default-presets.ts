export type Preset = {
  name: string;
  size: number;
};

export const defaultPresets: Preset[] = [
  { name: "sm", size: 500 },
  { name: "md", size: 800 },
  { name: "lg", size: 1200 }
];
