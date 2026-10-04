export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (value: any, row: T, index: number) => React.ReactNode; // Remove the ?
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  headerAlign?: 'left' | 'center' | 'right';
  cellClassName?: string;
  headerClassName?: string;
  width?: string;
}

interface CustomTableProps<T> extends TableProps<T> {
  isLoading?: boolean;
  showIndex?: boolean;
  indexLabel?: string | React.ReactNode;
  indexWidth?: string;
  indexClassName?: string;
  indexHeaderClassName?: string;
  startIndex?: number;
  tableClassName?: string;
  rowClassName?: string;
}
export type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
};