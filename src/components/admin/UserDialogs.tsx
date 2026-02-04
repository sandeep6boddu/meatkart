'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, Loader2, MoreHorizontal } from 'lucide-react'
import { createUser, updateUserRole, deleteUser, updateUserDetails } from '@/app/actions/admin-users'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function CreateUserDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await createUser(null, formData)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
            } else {
                toast.error(result.message)
            }
        } catch (e: any) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="tw-bg-primary hover:tw-bg-red-700 tw-text-white">
                    <Plus className="tw-mr-2 tw-h-4 tw-w-4" />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:tw-max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account. They will need to login with these credentials.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="tw-grid tw-gap-4 tw-py-4">
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="name" className="tw-text-right">
                            Name
                        </Label>
                        <Input id="name" name="name" className="tw-col-span-3" required />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="phone" className="tw-text-right">
                            Phone
                        </Label>
                        <Input id="phone" name="phone" className="tw-col-span-3" required placeholder="10 digits" />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="email" className="tw-text-right">
                            Email
                        </Label>
                        <Input id="email" name="email" type="email" className="tw-col-span-3" />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="password" className="tw-text-right">
                            Password
                        </Label>
                        <Input id="password" name="password" type="password" className="tw-col-span-3" placeholder="Optional for existing users" />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="role" className="tw-text-right">
                            Role
                        </Label>
                        <Select name="role" defaultValue="customer">
                            <SelectTrigger className="tw-col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" /> : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function EditUserDialog({ user, open, setOpen }: { user: any, open: boolean, setOpen: (open: boolean) => void }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await updateUserDetails(user.id, formData)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
            } else {
                toast.error(result.message)
            }
        } catch (e: any) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:tw-max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user details.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="tw-grid tw-gap-4 tw-py-4">
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="edit-name" className="tw-text-right">
                            Name
                        </Label>
                        <Input id="edit-name" name="name" defaultValue={user.name} className="tw-col-span-3" required />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="edit-phone" className="tw-text-right">
                            Phone
                        </Label>
                        <Input id="edit-phone" name="phone" defaultValue={user.phone} className="tw-col-span-3" required />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="edit-email" className="tw-text-right">
                            Email
                        </Label>
                        <Input id="edit-email" name="email" type="email" defaultValue={user.email || ''} className="tw-col-span-3" />
                    </div>
                    <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
                        <Label htmlFor="edit-role" className="tw-text-right">
                            Role
                        </Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger className="tw-col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" /> : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function UserActions({ user }: { user: any }) {
    const [loading, setLoading] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    async function handleRoleUpdate(newRole: string) {
        if (loading) return
        setLoading(true)
        try {
            const result = await updateUserRole(user.id, newRole)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (e) {
            toast.error('Failed to update role')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

        if (loading) return
        setLoading(true)
        try {
            const result = await deleteUser(user.id)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch (e) {
            toast.error('Failed to delete user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="tw-h-8 tw-w-8 tw-p-0">
                    <span className="tw-sr-only">Open menu</span>
                    <MoreHorizontal className="tw-h-4 tw-w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                    Copy User ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="tw-mr-2 tw-h-4 tw-w-4" />
                    Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="tw-text-xs tw-text-gray-500">Change Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleRoleUpdate('customer')} disabled={user.role === 'customer'}>
                    Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleUpdate('editor')} disabled={user.role === 'editor'}>
                    Editor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleUpdate('manager')} disabled={user.role === 'manager'}>
                    Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleUpdate('admin')} disabled={user.role === 'admin'}>
                    Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleUpdate('super_admin')} disabled={user.role === 'super_admin'}>
                    Super Admin
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="tw-text-red-600">
                    <Trash2 className="tw-mr-2 tw-h-4 tw-w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
            <EditUserDialog user={user} open={editOpen} setOpen={setEditOpen} />
        </DropdownMenu>
    )
}
