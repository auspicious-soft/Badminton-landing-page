export interface Header {
  label: string;
  key: string;
  width?: string;
  align?: 'left' | 'right';
}

export type Row = {
  [key: string]: any;
  creator?: { name: string; image?: string };
  isActive?: boolean;
};

export interface PaginationData {
  totalResults: number;
  resultsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// types/Player.ts
export interface Player {
  id: string | number;
  name: string;
  image?: string | null;
  type: "user" | "guest" | "available";
}