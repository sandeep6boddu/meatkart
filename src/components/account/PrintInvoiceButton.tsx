'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintInvoiceButton() {
  return (
    <Button 
      onClick={() => window.print()} 
      className="tw-flex tw-items-center tw-gap-2"
    >
      <Printer size={16} />
      Print Invoice
    </Button>
  )
}
