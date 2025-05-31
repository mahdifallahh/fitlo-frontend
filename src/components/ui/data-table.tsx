import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import { Button } from "./button";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import { ButtonProps, buttonVariants } from "./button";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  size?: ButtonProps["size"];
} & React.ComponentProps<"button">;

const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({
    className,
    isActive,
    size = "icon",
    ...props
  }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof PaginationLink>>(
  ({
    className,
    ...props
  }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span>قبلی</span>
    </PaginationLink>
  )
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof PaginationLink>>(
  ({
    className,
    ...props
  }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>بعدی</span>
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  )
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span"> >(
  ({
    className,
    ...props
  }, ref) => (
    <span
      ref={ref}
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
);
PaginationEllipsis.displayName = "PaginationEllipsis";

function usePagination({
  totalPages,
  siblingCount = 1,
  currentPage,
}: {
  totalPages: number;
  siblingCount?: number;
  currentPage: number;
}) {
  const range = React.useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3;
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + siblingCount * 2;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "ELLIPSIS", totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + siblingCount * 2;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [1, "ELLIPSIS", ...rightRange];
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = Array.from({ length: siblingCount * 2 + 1 }, (_, i) => leftSiblingIndex + i);
      return [1, "ELLIPSIS", ...middleRange, "ELLIPSIS", totalPages];
    }

    return [];
  }, [totalPages, siblingCount, currentPage]);

  return range;
}

export function DataTable<T>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "جستجو...",
  itemsPerPage = 5,
  onSearch,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  emptyMessage = "هیچ داده‌ای یافت نشد",
  className,
}: DataTableProps<T>) {
  const paginationRange = usePagination({ totalPages, currentPage });

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {searchable && (
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 w-full min-w-0 bg-white dark:bg-gray-800 border-[rgb(125,211,252)] "
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-900">
            <TableRow className="border-b border-gray-200 dark:border-gray-200">
              {columns.map((column, index) => (
                <TableHead key={index} className="text-gray-900 dark:text-gray-100 dark:bg-gray-700">{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell
                        ? column.cell(item)
                        : (item[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && paginationRange.length > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {paginationRange.map((page, index) => {
              if (page === "ELLIPSIS") {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => onPageChange?.(Number(page))}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 