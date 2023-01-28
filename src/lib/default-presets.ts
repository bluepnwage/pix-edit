export type Preset = {
  name: string;
  size: number;
  id: string;
};

export const defaultPresets: Preset[] = [
  { name: "sm", size: 500, id: "small-default" },
  { name: "md", size: 800, id: "medium-default" },
  { name: "lg", size: 1200, id: "large-default" }
];
