import { UserX, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface CustomerNotFoundProps {
  customerId?: string
}

export function CustomerNotFound({ customerId }: CustomerNotFoundProps) {
  return (
    <Card className="max-w-xl mx-auto my-12 text-center p-8">
      <CardContent className="pt-6 space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <UserX className="h-7 w-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Customer Not Found</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {customerId ? (
              <>
                No customer record matching ID{' '}
                <span className="font-mono font-semibold text-foreground">{customerId}</span> was
                found in the active evaluation cohort.
              </>
            ) : (
              'The requested customer profile could not be located.'
            )}
          </p>
        </div>

        <div className="pt-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer">
            <Link to="/customers">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Customer Directory</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
