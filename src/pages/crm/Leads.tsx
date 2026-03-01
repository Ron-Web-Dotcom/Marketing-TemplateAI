import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Filter, 
  Download,
  Mail,
  Phone,
  Sparkles,
  Loader2,
  Users
} from 'lucide-react';
import { blink, Lead } from '@/lib/blink';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export const Leads: React.FC = () => {
  const { organization, user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch Leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      return await (blink.db as any).leads.list({
        where: { orgId: organization.id },
        orderBy: { createdAt: 'desc' }
      }) as Lead[];
    },
    enabled: !!organization,
  });

  // Create Lead Mutation
  const createLeadMutation = useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      if (!organization || !user) throw new Error('Missing org or user');
      
      // Calculate AI Score (Mock logic for now, could use blink.ai.generateObject)
      const score = Math.floor(Math.random() * 40) + 60; // Start high for demo

      return await (blink.db as any).leads.create({
        ...newLead,
        score,
        orgId: organization.id,
        userId: user.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lead');
    }
  });

  const filteredLeads = leads.filter((lead: Lead) => 
    `${lead.firstName} ${lead.lastName} ${lead.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'contacted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'qualified': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'lost': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const handleAddDemoLead = () => {
    const demoLeads = [
      { firstName: 'James', lastName: 'Wilson', email: 'james@acme.com', phone: '+1 555-0123', source: 'LinkedIn', status: 'new' },
      { firstName: 'Elena', lastName: 'Rodriguez', email: 'elena@startup.io', phone: '+1 555-0144', source: 'Referral', status: 'qualified' },
      { firstName: 'Marcus', lastName: 'Chen', email: 'm.chen@enterprise.co', phone: '+1 555-0199', source: 'Website', status: 'contacted' },
    ];
    
    const randomLead = demoLeads[Math.floor(Math.random() * demoLeads.length)];
    createLeadMutation.mutate(randomLead as any);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Leads Management</h2>
            <p className="text-muted-foreground">Manage and track your potential customers with AI lead scoring.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={handleAddDemoLead} disabled={createLeadMutation.isPending}>
              {createLeadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary" />}
              Seed Data
            </Button>
            <Button size="sm" className="gap-2 shadow-elegant">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-elegant">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search leads..." 
                  className="pl-9 bg-muted/50 border-none focus-visible:ring-primary/20" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No leads found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or add a new lead to get started.</p>
                </div>
                <Button onClick={handleAddDemoLead} variant="secondary" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Add Demo Lead
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[250px]">Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead: Lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/30 transition-smooth group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                              {lead.firstName[0]}{lead.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{lead.firstName} {lead.lastName}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{lead.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(lead.status || 'new')}>
                            {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'New'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{lead.source || 'Direct'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("text-sm font-bold", getScoreColor(lead.score))}>
                              {lead.score}
                            </div>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full", lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 50 ? 'bg-amber-500' : 'bg-rose-500')}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-rose-500">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
