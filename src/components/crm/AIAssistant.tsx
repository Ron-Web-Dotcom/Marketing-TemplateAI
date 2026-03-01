import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User,
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { blink, Lead, Deal } from '@/lib/blink';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const { organization, user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimize] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your NeuralFlow Sales Assistant. How can I help you manage your CRM today?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Fetch context for AI
  const { data: leads = [] } = useQuery({
    queryKey: ['leads', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      return await (blink.db as any).leads.list({ where: { orgId: organization.id }, limit: 10 }) as Lead[];
    },
    enabled: !!organization && isOpen,
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['deals', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      return await (blink.db as any).deals.list({ where: { orgId: organization.id }, limit: 10 }) as Deal[];
    },
    enabled: !!organization && isOpen,
  });

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);

    try {
      // Prepare CRM context for AI
      const context = `
        Current User: ${user?.email}
        Organization: ${organization?.name}
        
        Recent Leads: ${leads.map((l: Lead) => `${l.firstName} ${l.lastName} (Score: ${l.score})`).join(', ')}
        Recent Deals: ${deals.map((d: Deal) => `${d.title} (Value: $${d.value}, Stage: ${d.stage})`).join(', ')}
      `;

      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      await blink.ai.streamText(
        {
          messages: [
            { 
              role: 'system', 
              content: `You are NeuralFlow AI, a sales-focused assistant embedded in a high-end CRM platform.
              You have access to the user's current leads and deals.
              Help them with:
              1. Analyzing lead quality and suggesting follow-ups.
              2. Identifying deal risks.
              3. Writing professional sales emails.
              4. Summarizing their current sales funnel status.
              
              Keep responses professional, concise, and actionable. 
              Always refer to leads and deals by name if they exist in the context provided.
              
              CRM CONTEXT:
              ${context}`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        },
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullResponse;
            return newMessages;
          });
        }
      );
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-glow animate-bounce hover:animate-none group"
      >
        <Sparkles className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-smooth" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed right-6 z-50 shadow-2xl border-primary/20 transition-all duration-300 ease-in-out",
      isMinimized ? "bottom-6 w-72 h-14" : "bottom-6 w-[400px] h-[600px] flex flex-col overflow-hidden"
    )}>
      <CardHeader className="p-4 bg-primary text-primary-foreground flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <CardTitle className="text-sm font-bold">NeuralFlow Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setIsMinimize(!isMinimized)}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((message, i) => (
              <div key={i} className={cn(
                "flex gap-3 max-w-[85%]",
                message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'user' ? "bg-muted" : "bg-primary/10 text-primary"
                )}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted/50 text-foreground rounded-tl-none"
                )}>
                  {message.content || (isGenerating && <Loader2 className="w-4 h-4 animate-spin" />)}
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t bg-background shrink-0">
            <div className="flex gap-2">
              <Input 
                placeholder="Ask NeuralFlow..." 
                className="bg-muted/50 border-none rounded-xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isGenerating}
              />
              <Button size="icon" className="rounded-xl shadow-elegant shrink-0" onClick={handleSend} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              AI can make mistakes. Always verify deal information.
            </p>
          </div>
        </>
      )}
    </Card>
  );
};
