import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  MoreHorizontal, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { blink, Deal } from '@/lib/blink';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const STAGES = [
  { id: 'discovery', label: 'Discovery', color: 'bg-blue-500' },
  { id: 'proposal', label: 'Proposal', color: 'bg-purple-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'closed_won', label: 'Closed Won', color: 'bg-emerald-500' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'bg-rose-500' },
];

export const Deals: React.FC = () => {
  const { organization, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Deals
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      return await (blink.db as any).deals.list({
        where: { orgId: organization.id },
        orderBy: { createdAt: 'desc' }
      }) as Deal[];
    },
    enabled: !!organization,
  });

  // Update Deal Stage Mutation
  const updateStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string, stage: string }) => {
      return await (blink.db as any).deals.update(id, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal stage updated');
    }
  });

  // Create Deal Mutation
  const createDealMutation = useMutation({
    mutationFn: async (newDeal: Partial<Deal>) => {
      if (!organization || !user) throw new Error('Missing org or user');
      return await (blink.db as any).deals.create({
        ...newDeal,
        orgId: organization.id,
        userId: user.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal created');
    }
  });

  const handleAddDemoDeal = () => {
    const demoDeals = [
      { title: 'Cloud Infrastructure Upgrade', value: 25000, stage: 'proposal' },
      { title: 'Global Marketing Campaign', value: 12000, stage: 'negotiation' },
      { title: 'Cybersecurity Audit', value: 8500, stage: 'discovery' },
      { title: 'API Integration Project', value: 5000, stage: 'closed_won' },
    ];
    
    const randomDeal = demoDeals[Math.floor(Math.random() * demoDeals.length)];
    createDealMutation.mutate(randomDeal as any);
  };

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal: Deal) => deal.stage === stageId);
  };

  const calculateStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum: number, d: Deal) => sum + Number(d.value), 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500 overflow-x-auto pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-full">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sales Pipeline</h2>
            <p className="text-muted-foreground">Track and manage your deals through custom stages.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleAddDemoDeal} disabled={createDealMutation.isPending}>
              <Sparkles className="w-4 h-4 text-primary" />
              Demo Deal
            </Button>
            <Button size="sm" className="gap-2 shadow-elegant">
              <Plus className="w-4 h-4" />
              New Deal
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex gap-6 min-w-max">
            {STAGES.map((stage) => (
              <div key={stage.id} className="w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                    <h3 className="font-semibold text-sm">{stage.label}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {getDealsByStage(stage.id).length}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    ${calculateStageTotal(stage.id).toLocaleString()}
                  </span>
                </div>

                <div className="bg-muted/30 rounded-xl p-2 min-h-[500px] border-2 border-dashed border-transparent hover:border-primary/20 transition-smooth">
                  {getDealsByStage(stage.id).map((deal: Deal) => (
                    <Card key={deal.id} className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-smooth border-none shadow-sm group">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-smooth">
                            {deal.title}
                          </h4>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1 opacity-0 group-hover:opacity-100 transition-smooth">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                            {Number(deal.value).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(deal.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-muted/50">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                              SC
                            </div>
                          </div>
                          
                          {stage.id !== 'closed_won' && stage.id !== 'closed_lost' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 hover:text-primary"
                              onClick={() => {
                                const nextStageIndex = STAGES.findIndex(s => s.id === stage.id) + 1;
                                if (nextStageIndex < STAGES.length) {
                                  updateStageMutation.mutate({ id: deal.id, stage: STAGES[nextStageIndex].id });
                                }
                              }}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getDealsByStage(stage.id).length === 0 && (
                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground italic">
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};