'use client'

import { Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { LaunchCareerItem } from '../../../types'

interface LaunchCareerTableProps {
    items: LaunchCareerItem[]
    loading: boolean
    onDelete: (id: string) => void
}

export function LaunchCareerTable({
    items,
    loading,
    onDelete,
}: LaunchCareerTableProps) {
    return (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[100px] text-[18px] font-bold text-foreground">
                            Image
                        </TableHead>
                        <TableHead className="text-[18px] font-bold text-foreground">
                            Title
                        </TableHead>
                        <TableHead className="text-[18px] font-bold text-foreground">
                            Category
                        </TableHead>
                        <TableHead className="text-right text-[18px] font-bold text-foreground">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-24" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-8 w-10 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : !items || items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-20 text-muted-foreground italic text-lg"
                            >
                                No items found in this section.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map(item => (
                            <TableRow
                                key={item._id}
                                className="hover:bg-muted/30 transition-colors group"
                            >
                                <TableCell>
                                    <div className="relative w-16 h-10 rounded-md overflow-hidden border border-muted shadow-sm bg-muted flex items-center justify-center">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-base font-bold text-foreground">
                                        {item.title}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {item.category}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                        onClick={() => onDelete(item._id)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
