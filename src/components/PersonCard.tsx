
import { useState, useEffect } from 'react';
import { ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface PersonCardProps {
  id: number;
  name: string;
  description: string;
  votes: number;
  category: string;
  onVote: (id: number) => void;
  layout?: 'grid' | 'list';
}

const categoryLabels: Record<string, string> = {
  politica: "Política",
  desporto: "Desporto",
  entretenimento: "Entretenimento",
  outro: "Outro"
};

const PersonCard = ({ id, name, description, votes, category, onVote, layout = 'grid' }: PersonCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const queryClient = useQueryClient();

  // Get or create browser fingerprint
  const { data: fingerprint } = useQuery({
    queryKey: ['fingerprint'],
    queryFn: async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    },
    staleTime: Infinity, // Only compute once per session
  });

  // Get the user's vote status
  const { data: voteStatus = false } = useQuery({
    queryKey: ['voteStatus', id],
    queryFn: async () => {
      if (!fingerprint) return false;

      const { data } = await supabase
        .from('votes')
        .select('*')
        .eq('person_id', id)
        .eq('browser_id', fingerprint)
        .single();

      const hasVoted = !!data;
      console.log('Vote status for id:', id, 'is:', hasVoted);
      return hasVoted;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const handleVote = async () => {
    if (!fingerprint) return;
    
    setIsVoting(true);
    
    // Optimistically update the UI
    console.log('Setting vote status to true for id:', id);
    queryClient.setQueryData(['voteStatus', id], true);
    
    try {
      await onVote(id);
      // The main query will be invalidated by the parent component
      setTimeout(() => setIsVoting(false), 300);
    } catch (error) {
      // If the vote fails, revert the optimistic update
      queryClient.setQueryData(['voteStatus', id], false);
      setIsVoting(false);
    }
  };

  if (layout === 'list') {
    return (
      <Card className="person-card">
        <div className="flex items-center p-4 gap-4">
          <div className="flex-grow">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <Badge variant="outline" className="mb-2">{categoryLabels[category]}</Badge>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {votes} votos
            </Badge>
            <Button 
              onClick={handleVote}
              variant={voteStatus ? "default" : "outline"}
              className="vote-button"
              disabled={isVoting}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Votar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="person-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <Badge variant="outline" className="mb-2">{categoryLabels[category]}</Badge>
            <Badge variant="secondary">
              {votes} votos
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleVote}
          variant="outline"
          className="vote-button w-full"
          disabled={isVoting}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          Votar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonCard;
