
import { useState } from 'react';
import { ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PersonCardProps {
  id: number;
  name: string;
  description: string;
  votes: number;
  onVote: (id: number) => void;
}

const PersonCard = ({ id, name, description, votes, onVote }: PersonCardProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = () => {
    setIsVoting(true);
    onVote(id);
    setTimeout(() => setIsVoting(false), 300);
  };

  return (
    <Card className="person-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge variant="secondary" className="mt-1">
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
