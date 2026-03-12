'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { websiteApi } from '../../services/website.api'
import { LaunchCareerItem } from '../../types'
import { LaunchCareerTable } from './components/LaunchCareerTable'
import { CreateCareerModal } from './components/CreateCareerModal'
import { DeleteModal } from '../../components/DeleteModal'

export function LaunchCareerManagement() {
    const [activeTab, setActiveTab] = useState<'student' | 'school'>('student')
    const [items, setItems] = useState<LaunchCareerItem[]>([])
    const [loading, setLoading] = useState(true)

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await websiteApi.getLaunchCareerItems(activeTab)
            if (res.success) {
                // Handle data.data if nested, similar to other API calls
                const data = res.data
                if (Array.isArray(data)) {
                    setItems(data)
                } else if (data && (data as any).data && Array.isArray((data as any).data)) {
                    setItems((data as any).data)
                } else {
                    setItems([])
                }
            }
        } catch (error) {
            toast.error('Failed to fetch items')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [activeTab])

    const handleCreate = async (formData: FormData) => {
        setSubmitting(true)
        try {
            const res = await websiteApi.createLaunchCareerItem(formData)
            if (res.success) {
                toast.success('Item created successfully')
                setIsCreateModalOpen(false)
                fetchItems()
            } else {
                toast.error('Failed to create item')
            }
        } catch (error) {
            toast.error('Error creating item')
        } finally {
            setSubmitting(false)
        }
    }

    const confirmDelete = (id: string) => {
        setDeletingId(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!deletingId) return
        setSubmitting(true)
        try {
            const res = await websiteApi.deleteLaunchCareerItem(deletingId)
            if (res.success) {
                toast.success('Item deleted successfully')
                setIsDeleteModalOpen(false)
                fetchItems()
            } else {
                toast.error('Failed to delete item')
            }
        } catch (error) {
            toast.error('Error deleting item')
        } finally {
            setSubmitting(false)
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Launch Your Career</h2>
                    <p className="text-sm text-muted-foreground">Manage career opportunities for Students and Schools</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-6 font-semibold"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="school">School</TabsTrigger>
                </TabsList>

                <TabsContent value="student" className="mt-0">
                    <LaunchCareerTable items={items} loading={loading} onDelete={confirmDelete} />
                </TabsContent>
                <TabsContent value="school" className="mt-0">
                    <LaunchCareerTable items={items} loading={loading} onDelete={confirmDelete} />
                </TabsContent>
            </Tabs>

            <CreateCareerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                category={activeTab}
                submitting={submitting}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                loading={submitting}
                title="Delete Item"
                description="Are you sure you want to delete this item? This action cannot be undone."
            />
        </div>
    )
}
