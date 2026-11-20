import { UserX, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface CustomerNotFoundProps {
  customerId?: string
}

export function CustomerNotFound({ customerId }: CustomerNotFoundProps) {
  return (
    <Card className="max-w-xl mx-auto my-12 text-center p-8 bg-surface border-border">
      <CardContent className="pt-6 space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-muted-foreground border border-border">
          <UserX className="h-7 w-7 text-muted-foreground" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Customer Not Found</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            {customerId ? (
              <>
                We couldn't find a customer with ID{' '}
                <span className="font-mono font-semibold text-foreground">{customerId}</span>. The
                account may have been moved or the ID may be incorrect.
              </>
            ) : (
              "The requested customer profile couldn't be found."
            )}
          </p>
        </div>

        <div className="pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer bg-surface-elevated border-border"
          >
            <Link to="/app/customers">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Customers</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
