import { motion } from 'motion/react'
import { Users2, Filter, Layers, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table'
import { formatCurrency, formatNumber } from '@/lib/formatters'

interface SegmentData {
  id: string
  name: string
  count: number
  avgSpend: number
  churnRisk: 'low' | 'moderate' | 'high'
  clvGrowth: string
}

const segmentRows: SegmentData[] = [
  {
    id: 'seg-1',
    name: 'Enterprise VIP (Champions)',
    count: 712,
    avgSpend: 14200,
    churnRisk: 'low',
    clvGrowth: '+18.4%',
  },
  {
    id: 'seg-2',
    name: 'Mid-Market Consistent',
    count: 2138,
    avgSpend: 5400,
    churnRisk: 'low',
    clvGrowth: '+8.2%',
  },
  {
    id: 'seg-3',
    name: 'At-Risk Expansion',
    count: 1425,
    avgSpend: 3800,
    churnRisk: 'moderate',
    clvGrowth: '-2.1%',
  },
  {
    id: 'seg-4',
    name: 'Dormant Accounts',
    count: 2850,
    avgSpend: 920,
    churnRisk: 'high',
    clvGrowth: '-14.6%',
  },
]

export function SegmentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-7xl"
    >
      <PageHeader
        title="Customer Segments"
        description="Behavioral cohorts, RFM classifications, and lifetime value distribution."
        actions={
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            Filter Cohorts
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <CardTitle>Cohort RFM Performance Matrix</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            Total Analyzed: {formatNumber(7125)} accounts
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">Avg. Spend</TableHead>
                <TableHead>Churn Risk</TableHead>
                <TableHead className="text-right">CLV Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segmentRows.map((seg) => (
                <TableRow key={seg.id}>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Users2 className="h-3.5 w-3.5 text-primary" />
                      <span>{seg.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">
                    {formatNumber(seg.count)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">
                    {formatCurrency(seg.avgSpend)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        seg.churnRisk === 'low'
                          ? 'teal'
                          : seg.churnRisk === 'moderate'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {seg.churnRisk.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span
                      className={`inline-flex items-center font-medium ${
                        seg.clvGrowth.startsWith('+') ? 'text-primary' : 'text-destructive'
                      }`}
                    >
                      <ArrowUpRight className="mr-0.5 h-3 w-3" />
                      {seg.clvGrowth}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SegmentsPage
