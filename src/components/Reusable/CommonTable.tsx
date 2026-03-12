"use client";
import React, { useState, useMemo } from "react";
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column {
    header: string;
    accessor: string;
}

interface CommonTableProps {
    title?: string;
    subtitle?: string;
    columns: Column[];
    data: any[];
    filterOptions: string[];
}

const CommonTable: React.FC<CommonTableProps> = ({ title, subtitle, columns, data, filterOptions }) => {
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
                selectedFilter === "All" || item.grade === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [data, searchTerm, selectedFilter]);


    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };


    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
                <div className="flex justify-between gap-3 w-full items-center">

                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="pl-9 pr-4 py-2 text-sm bg-[#F9F9F9] border w-[400px] border-gray-200 rounded-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <select
                        className="border border-gray-200 rounded-full py-1 px-5 items-center text-sm focus:ring-1 focus:ring-blue-400"
                        value={selectedFilter}
                        onChange={(e) => {
                            setSelectedFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {filterOptions.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white border-2 border-[#0000001A] rounded-2xl p-1 overflow-x-auto">

                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="text-gray-600 popmed border-b-2 border-gray-200">
                            {columns.map((col) => (
                                <th key={col.accessor} className="py-4 px-4 font-semibold">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, idx) => (
                            <tr
                                key={idx}
                                className="border-b-2 mb-4 transition-all rounded-lg"
                            >
                                {columns.map((col) => (
                                    <td key={col.accessor} className="py-4 px-4 text-gray-700">
                                        {col.accessor === "status" ? (
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {row.status}
                                            </span>
                                        ) : col.accessor === "actions" ? (
                                            <button className="text-red-500 hover:text-red-600">
                                                <Trash2 />
                                            </button>
                                        ) : (
                                            row[col.accessor]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>


                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-400"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>entries</span>
                    </div>


                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                    </div>


                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>


                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === page
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}


                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonTable;