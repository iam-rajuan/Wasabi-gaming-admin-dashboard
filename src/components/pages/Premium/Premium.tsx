'use client'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Headers from '../../Reusable/Headers'
import { FaPlus } from 'react-icons/fa'
import { MdOutlineDone } from 'react-icons/md'
import { Trash2 } from 'lucide-react'
import ReusableModal from '../../Reusable/ReusableModal'
import { planApi, Plan } from '@/lib/api/planApi'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const Premium = () => {
  const [open, setOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null)
  const queryClient = useQueryClient()

  // Fetch all plans
  const { data: plansData, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: planApi.getAllPlans,
  })

  // Create plan mutation
  const createMutation = useMutation({
    mutationFn: planApi.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setOpen(false)
      toast.success('Plan created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create plan')
    },
  })

  // Update plan mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      planApi.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setOpen(false)
      setEditingPlan(null)
      toast.success('Plan updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update plan')
    },
  })

  // Delete plan mutation
  const deleteMutation = useMutation({
    mutationFn: planApi.deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setDeletingPlan(null)
      toast.success('Plan deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete plan')
    },
  })

  const handleSave = (data: any) => {
    // Validate required fields
    if (!data.name || !data.price || !data.type) {
      toast.error('Please fill in all required fields')
      return
    }

    const payload = {
      name: data.name,
      price: Number(data.price),
      type: data.type,
      features: Array.isArray(data.features) ? data.features : [],
      subscriptionCategory: data.subscriptionCategory,
    }

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan._id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setOpen(true)
  }

  const handleAddNew = () => {
    setEditingPlan(null)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditingPlan(null)
  }

  const handleDeleteClick = (plan: Plan) => {
    setDeletingPlan(plan)
  }

  const handleConfirmDelete = () => {
    if (deletingPlan) {
      deleteMutation.mutate(deletingPlan._id)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-3xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="flex flex-col justify-between w-full bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />

                <div className="mb-6">
                  <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mt-0.5" />
                      <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const plans = plansData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Headers
          title={'Plans'}
          subHeader={'Manage all plans available for your students'}
        />
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#FFFF00] text-black px-4 py-2 rounded-3xl font-medium popmed
                    shadow-[0px_2px_4px_-2px_#0000001A,0px_4px_6px_-1px_#0000001A]
                    hover:bg-yellow-400 transition-colors duration-200"
        >
          <FaPlus size={14} />
          Add Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">
            No plans available. Create your first plan!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: Plan) => (
            <div
              key={plan._id}
              className="flex flex-col justify-between w-full bg-white rounded-2xl border border-gray-200 
                      shadow-[0px_1px_2px_0px_#0000000D] hover:shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] 
                      p-6 transition-all duration-300 hover:-translate-y-1 relative group"
            >
              {/* Delete Button - Top Right */}
              <button
                onClick={() => handleDeleteClick(plan)}
                className="absolute top-12 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-gray-100 z-10"
                title="Delete plan"
              >
                <Trash2 size={18} />
              </button>

              {/* Category Badge */}
              {plan.subscriptionCategory && (
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${plan.subscriptionCategory === 'students'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                      }`}
                  >
                    {plan.subscriptionCategory}
                  </span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-10">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {plan.type === 'monthly'
                        ? 'Monthly Plan'
                        : plan.type === 'weekly'
                          ? 'Weekly Plan'
                          : 'Yearly Plan'}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold text-gray-900">
                      £ {plan.price}
                    </p>
                    {plan.name !== 'free' && (
                      <p className="text-sm text-gray-500">
                        /
                        {plan.type === 'monthly'
                          ? 'month'
                          : plan.type === 'weekly'
                            ? 'week'
                            : 'year'}
                      </p>
                    )}
                  </div>
                  {plan.type === 'yearly' && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="text-green-600 font-medium">
                        £ {Math.round(plan.price / 12)}/month
                      </span>{' '}
                      (Save 20%)
                    </p>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features && plan.features.length > 0 ? (
                    plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <MdOutlineDone className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 italic">
                      No features added
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleEdit(plan)}
                className="mt-8 w-full py-3 rounded-xl font-medium text-sm shadow-sm transition-colors
                        bg-[#FFFF00] text-black hover:bg-yellow-400"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      <ReusableModal
        isOpen={open}
        onClose={handleCloseModal}
        onSave={handleSave}
        location="plans"
        title={editingPlan ? 'Update Plan' : 'Add New Plan'}
        edit={!!editingPlan}
        submitText={editingPlan ? 'Update' : 'Add Plan'}
        data={editingPlan}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingPlan}
        onOpenChange={open => !open && setDeletingPlan(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the plan &quot;
              <span className="font-semibold text-gray-900">
                {deletingPlan?.name}
              </span>
              &quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* ✅ Footer stays inside Content */}
          <AlertDialogFooter>
            {/* ✅ Custom wrapper for perfect alignment */}
            <div className="flex w-full items-center justify-end gap-4">
              <AlertDialogCancel className="rounded-[20px] h-10">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white rounded-[20px] h-10"
              >
                {deleteMutation.isPending ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Plan'
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Premium
