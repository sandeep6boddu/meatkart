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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus } from 'lucide-react'
import { addAddress } from '@/app/actions/user'
import { toast } from 'sonner'

export function AddAddressDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await addAddress(formData)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Address added successfully')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="tw-mr-2" />
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:tw-max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Add a new delivery address to your account.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="tw-grid tw-gap-4 tw-py-4">
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
            <Label htmlFor="type" className="tw-text-right">
              Type
            </Label>
            <Input id="type" name="type" placeholder="Home, Work, etc." className="tw-col-span-3" required />
          </div>
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
            <Label htmlFor="street" className="tw-text-right">
              Street
            </Label>
            <Input id="street" name="street" placeholder="H.No, Street Name" className="tw-col-span-3" required />
          </div>
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
            <Label htmlFor="landmark" className="tw-text-right">
              Landmark
            </Label>
            <Input id="landmark" name="landmark" placeholder="Near..." className="tw-col-span-3" />
          </div>
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
            <Label htmlFor="city" className="tw-text-right">
              City
            </Label>
            <Input id="city" name="city" placeholder="Hyderabad" className="tw-col-span-3" required />
          </div>
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
            <Label htmlFor="state" className="tw-text-right">
              State
            </Label>
            <Input id="state" name="state" placeholder="Telangana" className="tw-col-span-3" required />
          </div>
          <div className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-4">
            <Label htmlFor="pincode" className="tw-text-right">
              Pincode
            </Label>
            <Input id="pincode" name="pincode" placeholder="500001" className="tw-col-span-3" required />
          </div>
          <div className="tw-flex tw-items-center tw-gap-2 tw-ml-auto tw-col-span-4">
            <Checkbox id="isDefault" name="isDefault" />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
