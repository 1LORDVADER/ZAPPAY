import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/_core/hooks/useAuth'
import { useLocation } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Download, Search, Filter, Building2, Truck, Store, Leaf, Package } from 'lucide-react'

const BUSINESS_TYPE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  farmer: { label: 'Farmer', color: 'bg-green-100 text-green-800', icon: <Leaf className="h-3 w-3" /> },
  dispensary: { label: 'Dispensary', color: 'bg-blue-100 text-blue-800', icon: <Store className="h-3 w-3" /> },
  distributor: { label: 'Distributor', color: 'bg-slate-200 text-slate-800', icon: <Package className="h-3 w-3" /> },
  transporter: { label: 'Transporter', color: 'bg-orange-100 text-orange-800', icon: <Truck className="h-3 w-3" /> },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-800', icon: <Building2 className="h-3 w-3" /> },
}

export default function AdminWaitlist() {
  const { user, loading } = useAuth()
  const [, navigate] = useLocation()
  const [search, setSearch] = useState('')
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')

  const { data: waitlist, isLoading } = trpc.wholesalerWaitlist.getAll.useQuery()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    navigate('/')
    return null
  }

  const filtered = (waitlist ?? []).filter((entry) => {
    const matchesSearch =
      !search ||
      entry.businessName.toLowerCase().includes(search.toLowerCase()) ||
      entry.contactName.toLowerCase().includes(search.toLowerCase()) ||
      entry.email.toLowerCase().includes(search.toLowerCase()) ||
      entry.state.toLowerCase().includes(search.toLowerCase())

    const matchesType = businessTypeFilter === 'all' || entry.businessType === businessTypeFilter
    const matchesState = stateFilter === 'all' || entry.state === stateFilter

    return matchesSearch && matchesType && matchesState
  })

  const states = Array.from(new Set((waitlist ?? []).map((e) => e.state))).sort()

  const counts = {
    total: waitlist?.length ?? 0,
    farmer: waitlist?.filter((e) => e.businessType === 'farmer').length ?? 0,
    dispensary: waitlist?.filter((e) => e.businessType === 'dispensary').length ?? 0,
    distributor: waitlist?.filter((e) => e.businessType === 'distributor').length ?? 0,
    transporter: waitlist?.filter((e) => e.businessType === 'transporter').length ?? 0,
  }

  const handleExportCSV = () => {
    if (!filtered.length) return
    const headers = ['Business Name', 'Contact Name', 'Email', 'Phone', 'Business Type', 'State', 'City', 'License #', 'Monthly Volume', 'Message', 'Joined']
    const rows = filtered.map((e) => [
      e.businessName,
      e.contactName,
      e.email,
      e.phone ?? '',
      e.businessType,
      e.state,
      e.city ?? '',
      e.licenseNumber ?? '',
      e.monthlyVolume ?? '',
      (e.message ?? '').replace(/,/g, ';'),
      new Date(e.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zappay-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Wholesaler Waitlist</h1>
              <p className="text-sm text-slate-500">Admin Dashboard — ZAPPAY</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              ← Back to Admin
            </Button>
            <Button
              size="sm"
              onClick={handleExportCSV}
              className="bg-blue-900 hover:bg-blue-800 text-white"
              disabled={!filtered.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV ({filtered.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Signups', value: counts.total, color: 'bg-blue-900 text-white' },
            { label: 'Farmers', value: counts.farmer, color: 'bg-green-600 text-white' },
            { label: 'Dispensaries', value: counts.dispensary, color: 'bg-blue-600 text-white' },
            { label: 'Distributors', value: counts.distributor, color: 'bg-blue-800 text-white' },
            { label: 'Transporters', value: counts.transporter, color: 'bg-orange-500 text-white' },
          ].map((stat) => (
            <Card key={stat.label} className={`${stat.color} border-0`}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter &amp; Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or state..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Business Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="dispensary">Dispensary</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="transporter">Transporter</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-slate-500">Loading waitlist data...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No signups yet</p>
                <p className="text-slate-400 text-sm mt-1">
                  {waitlist?.length ? 'No results match your filters.' : 'Wholesaler signups will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold">Business</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">License #</TableHead>
                      <TableHead className="font-semibold">Monthly Vol.</TableHead>
                      <TableHead className="font-semibold">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((entry) => {
                      const typeInfo = BUSINESS_TYPE_LABELS[entry.businessType] ?? BUSINESS_TYPE_LABELS.other
                      return (
                        <TableRow key={entry.id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="font-medium text-slate-900">{entry.businessName}</div>
                            {entry.message && (
                              <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate" title={entry.message}>
                                "{entry.message}"
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{entry.contactName}</div>
                            <div className="text-xs text-slate-500">{entry.email}</div>
                            {entry.phone && <div className="text-xs text-slate-400">{entry.phone}</div>}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${typeInfo.color} flex items-center gap-1 w-fit border-0`}>
                              {typeInfo.icon}
                              {typeInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{entry.state}</div>
                            {entry.city && <div className="text-xs text-slate-500">{entry.city}</div>}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-mono text-slate-600">
                              {entry.licenseNumber ?? <span className="text-slate-300">—</span>}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">
                              {entry.monthlyVolume ?? <span className="text-slate-300">—</span>}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-500">
                              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
