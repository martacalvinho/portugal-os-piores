
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

  const handleVote = () => {
    setIsVoting(true);
    onVote(id);
    setTimeout(() => setIsVoting(false), 300);
  };

  if (layout === 'list') {
    return (
      <Card className="person-card">
        <div className="flex items-center p-4 gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{name}</h3>
              <Badge variant="outline">{categoryLabels[category]}</Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {votes} votos
            </Badge>
            <Button 
              onClick={handleVote}
              variant="outline"
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
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{name}</h3>
              <Badge variant="outline">{categoryLabels[category]}</Badge>
            </div>
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
