'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  X,
  User,
} from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { websiteApi } from '../../services/website.api'
import { toast } from 'sonner'
import Image from 'next/image'
import { DeleteModal } from '../../components/DeleteModal'

export function TeamManagement() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const res = await websiteApi.getTeam()
      if (res.success) {
        // Handle both { success: true, data: [] } and { success: true, data: { data: [] } }
        const data = res.data
        if (Array.isArray(data)) {
          setMembers(data)
        } else if (
          data &&
          typeof data === 'object' &&
          Array.isArray((data as any).data)
        ) {
          setMembers((data as any).data)
        } else {
          setMembers([])
        }
      }
    } catch (error) {
      toast.error('Failed to fetch team members')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      profession: '',
    })
    setSelectedFile(null)
    setPreview('')
    setEditingMember(null)
  }

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setFormData({
      name: member.name || '',
      profession: member.profession || '',
    })
    setPreview(member.image || '')
    setIsModalOpen(true)
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      setSubmitting(true)
      const res = await websiteApi.deleteTeamMember(deletingId)
      if (res.success) {
        toast.success('Team member removed')
        fetchTeam()
        setIsDeleteModalOpen(false)
      }
    } catch (error) {
      toast.error('Failed to remove member')
    } finally {
      setSubmitting(false)
      setDeletingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const fd = new FormData()
      // The API expects data as an array of objects for bulk, or single?
      // User said: data: [ { "name": "...", "profession": "..." } ]
      // I'll send it as an array with one member for consistency with user's example.
      const dataPayload = [
        {
          name: formData.name,
          profession: formData.profession,
        },
      ]

      fd.append('data', JSON.stringify(dataPayload))
      if (selectedFile) {
        fd.append('image', selectedFile)
      }

      let res
      if (editingMember) {
        res = await websiteApi.updateTeamMember(editingMember._id, fd)
      } else {
        res = await websiteApi.createTeamMember(fd)
      }

      if (res.success) {
        toast.success(
          editingMember ? 'Updated successfully' : 'Added successfully',
        )
        setIsModalOpen(false)
        resetForm()
        fetchTeam()
      } else {
        toast.error((res as any).message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage the team profiles displayed on the website.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-6 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px] text-[18px] font-bold text-foreground">
                Profile
              </TableHead>
              <TableHead className="text-[18px] font-bold text-foreground">
                Name
              </TableHead>
              <TableHead className="text-[18px] font-bold text-foreground">
                Profession
              </TableHead>
              <TableHead className="text-right text-[18px] font-bold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : !Array.isArray(members) || members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-20 text-muted-foreground italic text-lg"
                >
                  {loading ? 'Loading...' : 'No team members added yet.'}
                </TableCell>
              </TableRow>
            ) : (
              members.map(member => (
                <TableRow
                  key={member._id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <TableCell>
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-muted shadow-sm bg-muted flex items-center justify-center">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-base font-bold text-foreground">
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-base font-medium text-muted-foreground">
                      {member.profession}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
                        onClick={() => confirmDelete(member._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingMember ? 'Edit Member' : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full border-4 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden bg-muted group shadow-inner">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground/20" />
                )}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase">
                    Upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Profile Photo
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  className="rounded-xl h-12 text-lg font-medium shadow-none focus-visible:ring-1"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="profession"
                  className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Profession
                </Label>
                <Input
                  id="profession"
                  className="rounded-xl h-12 text-lg font-medium shadow-none focus-visible:ring-1"
                  value={formData.profession}
                  onChange={e =>
                    setFormData({ ...formData, profession: e.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t mt-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full px-6 font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-10 font-bold h-12 shadow-none"
              >
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingMember ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={submitting}
        title="Remove Team Member?"
        description="Are you sure you want to remove this member from the team? This action is permanent."
      />
    </div>
  )
}
