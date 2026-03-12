"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReusablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  activePageClassName?: string;
}

export const ReusablePagination: React.FC<ReusablePaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
  activePageClassName = "bg-teal-600 text-white border-teal-600",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (currentPage > 2) {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-prev");
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) pages.push("ellipsis-next");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const start = (currentPage - 1) * resultsPerPage + 1;
  const end = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between w-full mt-6">
      {/* Left-aligned text */}
      <div className="text-sm text-muted-foreground w-full">
        <span>Showing {start} to {end} of {totalResults} results</span>
      </div>

      {/* Right-aligned pagination */}
      <Pagination>
        <PaginationContent className="flex gap-1 items-center justify-end w-full">
          {/* Prev Button */}
          <PaginationItem>
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-100 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </PaginationItem>

          {/* Page Numbers */}
          {pages.map((page, idx) => (
            <PaginationItem key={idx}>
              {typeof page === "number" ? (
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-9 h-9 rounded-md border text-sm transition ${
                    currentPage === page
                      ? activePageClassName
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <PaginationEllipsis />
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <button
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={`flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-100 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
