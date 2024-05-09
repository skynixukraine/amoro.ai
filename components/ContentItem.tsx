export interface ContentItem {
  id?: number; // Add this line to include the id property
  label: string;
  value: string;
  link?: string;
  setValue: (value: string) => void;
  file?: File;
  comment?: string;
  setComment?: (value: string) => void;
}
