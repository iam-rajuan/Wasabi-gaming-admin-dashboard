'use client';

import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/common/pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Column {
    header: string;
    accessor: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    filterOptions?: string[];
    filterKey?: string; // Key to filter by (e.g. 'grade')
    searchKey?: string; // Key to search (or search all values)
}

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    filterOptions = [],
    filterKey,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesFilter =
                selectedFilter === "All" || !filterKey || item[filterKey] === selectedFilter;

            return matchesSearch && matchesFilter;
        });
    }, [data, searchTerm, selectedFilter, filterKey]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <div className="flex justify-between gap-3 w-full items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 w-[300px] sm:w-[400px] bg-[#F9F9F9] rounded-full"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {filterOptions.length > 0 && (
                        <select
                            className="border border-gray-200 rounded-full py-2 px-5 text-sm focus:ring-1 focus:ring-blue-400 bg-white"
                            value={selectedFilter}
                            onChange={(e) => {
                                setSelectedFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            {filterOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="bg-white border-2 border-[#0000001A] rounded-2xl p-1 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white hover:bg-white border-b-2 border-gray-200">
                            {columns.map((col) => (
                                <TableHead key={col.accessor} className="py-4 px-4 font-semibold text-gray-600 popmed text-base">
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.length > 0 ? (
                            currentData.map((row, idx) => (
                                <TableRow key={idx} className="border-b-2 last:border-0 hover:bg-gray-50/50">
                                    {columns.map((col) => (
                                        <TableCell key={col.accessor} className="py-4 px-4 text-gray-700">
                                            {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(val) => {
                        setItemsPerPage(val);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </div>
    );
};
