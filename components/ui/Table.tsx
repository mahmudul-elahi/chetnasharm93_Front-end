"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "./Pagination";
import { Column, TableProps } from "@/types/table";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
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
  theadClassName?: string;
  tbodyClassName?: string;
  rowClassName?: string;
  headerRowClassName?: string;
  rounded?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

// Wrap plain text/number values in a span with text cursor.
// React elements (badges, buttons, etc.) are passed through as-is.
function renderCellContent(content: React.ReactNode): React.ReactNode {
  if (typeof content === "string" || typeof content === "number") {
    return <span className="ct-text">{content}</span>;
  }
  return content;
}

// Returns true if the mousedown target is a plain-text span (ct-text),
// meaning the user wants to select text, not drag.
function isTextTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof Element)) return false;
  let node: Element | null = el as Element;
  while (node) {
    if (node.classList?.contains("ct-text")) return true;
    // Stop walking up at the table container boundary
    if (node.classList?.contains("custom-table-container")) break;
    node = node.parentElement;
  }
  return false;
}

export default function CustomTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage: externalItemsPerPage,
  isLoading = false,
  showIndex = true,
  indexLabel = "#",
  indexWidth = "70px",
  indexClassName = "px-4 py-3 text-center font-semibold",
  indexHeaderClassName = "text-center",
  startIndex = 1,
  tableClassName = "",
  theadClassName = "",
  tbodyClassName = "",
  rowClassName = "",
  headerRowClassName = "",
  rounded = "rounded-xl",
  emptyMessage = "No data available",
  emptyIcon,
  pagination,
  onPageChange,
}: CustomTableProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage] = useState(10);

  const isServerPaginated = !!pagination && !!onPageChange;

  const itemsPerPage = isServerPaginated
    ? pagination.per_page
    : (externalItemsPerPage ?? internalItemsPerPage);

  const currentPage = isServerPaginated
    ? pagination.current_page
    : internalCurrentPage;

  const totalPages = isServerPaginated
    ? pagination.last_page
    : Math.ceil(data?.length / itemsPerPage);

  const totalItems = isServerPaginated ? pagination.total : data?.length;
  const [isDraggable, setIsDraggable] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);

  const DRAG_THRESHOLD = 5;

  useEffect(() => {
    const checkScroll = () => {
      const el = tableContainerRef.current;
      if (el) setIsDraggable(el.scrollWidth > el.clientWidth);
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [data, columns]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    // If clicked on a ct-text span, let the browser handle selection normally
    if (isTextTarget(e.target)) return;

    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - tableContainerRef.current.offsetLeft;
    startY.current = e.pageY;
    scrollLeft.current = tableContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !tableContainerRef.current) return;

    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const deltaX = Math.abs(x - startX.current);
    const deltaY = Math.abs(e.pageY - startY.current);

    if (!isDragging.current) {
      if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
        if (deltaX >= deltaY) {
          isDragging.current = true;
          window.getSelection()?.removeAllRanges();
        } else {
          isDown.current = false;
          return;
        }
      } else {
        return;
      }
    }

    e.preventDefault();
    const walk = (x - startX.current) * 1.5;
    tableContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handlePageChange = isServerPaginated
    ? onPageChange
    : setInternalCurrentPage;

  const currentData = isServerPaginated
    ? data
    : data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSerialNumber = (rowIndex: number) => {
    if (isServerPaginated) {
      return (
        (pagination.current_page - 1) * pagination.per_page +
        rowIndex +
        startIndex
      );
    } else {
      return startIndex + (currentPage - 1) * itemsPerPage + rowIndex;
    }
  };

  const indexColumn = {
    header: typeof indexLabel === "string" ? indexLabel : "#",
    render: (_: any, __: T, index: number) => getSerialNumber(index),
    cellClassName: indexClassName,
    headerClassName: indexHeaderClassName,
    width: indexWidth,
  } as Column<T>;

  const displayColumns = showIndex ? [indexColumn, ...columns] : columns;
  const hasNoData = !isLoading && (!data || data?.length === 0);

  const cursorClass = isDraggable ? "cursor-grab active:cursor-grabbing" : "";

  return (
    <div className="w-full">
      {/*
        Cursor rules:
        - Container: cursor-grab (Tailwind)
        - Everything inside inherits grab by default
        - .ct-text spans: cursor text + user-select text  ← only plain text values
        - Interactive elements (button/a/input): cursor pointer
      */}
      <style>{`
        .custom-table-container * { cursor: inherit; }
        .ct-text { cursor: text !important; user-select: text !important; }
        .custom-table-container button,
        .custom-table-container a,
        .custom-table-container input,
        .custom-table-container select,
        .custom-table-container textarea,
        .custom-table-container [role="button"] { cursor: pointer !important; }
      `}</style>

      <div className={`${rounded} overflow-hidden border border-gray-200`}>
        <div
          ref={tableContainerRef}
          className={`custom-table-container overflow-x-auto overflow-y-visible select-none ${cursorClass}`}
          style={{ userSelect: "none" }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <table className={`w-full border-collapse ${tableClassName}`}>
            <thead className={`${theadClassName}`}>
              <tr
                className={`border-b border-white/20 bg-linear-to-r from-primary via-primary/90 to-secondary text-white ${headerRowClassName}`}
              >
                {displayColumns.map((col, i) => (
                  <th
                    key={i}
                    className={`
                      px-4 py-3 
                      font-semibold text-sm 
                      whitespace-nowrap
                      ${col.headerClassName || ""}
                    `}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {/* Header text wrapped so it can be selected */}
                    {typeof col.header === "string" || typeof col.header === "number"
                      ? <span className="ct-text">{col.header}</span>
                      : col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={`bg-white ${tbodyClassName}`}>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i} className={`border-b border-gray-200 ${rowClassName}`}>
                    {displayColumns.map((_, j) => (
                      <td key={j} className="px-4 py-3 overflow-visible">
                        <Skeleton className="h-5 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : hasNoData ? (
                <tr>
                  <td
                    colSpan={displayColumns.length}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      {emptyIcon ? (
                        emptyIcon
                      ) : (
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                      <p className="text-gray-500 text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((row, rowIndex) => (
                  <tr
                    key={row.id || rowIndex}
                    className={`
                      border-b border-gray-200 
                      hover:bg-gray-50 
                      transition-colors duration-200
                      ${rowClassName}
                    `}
                  >
                    {displayColumns.map((col, colIndex) => {
                      const customClass = col.cellClassName || "px-4 py-3";
                      const value = col.accessor ? row[col.accessor] : undefined;
                      const content = col.render
                        ? col.render(value, row, rowIndex)
                        : (value as React.ReactNode);

                      return (
                        <td
                          key={colIndex}
                          className={`${customClass} overflow-visible`}
                        >
                          {renderCellContent(content)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!hasNoData && totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            scrollOnChange={true}
            scrollTargetId="user-table-container"
            scrollOffset={80}
          />
        </div>
      )}
    </div>
  );
}