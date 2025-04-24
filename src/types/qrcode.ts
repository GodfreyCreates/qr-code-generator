export interface QRCodeConfig {
  value: string;
  size: number;
  bgColor: string;
  fgColor: string;
  level: string;
  includeMargin: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export interface HistoryItem extends QRCodeConfig {
  id: string;
  createdAt: string;
}