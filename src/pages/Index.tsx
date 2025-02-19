
import { useState, useEffect } from 'react';
import PersonCard from '../components/PersonCard';
import AddPersonModal from '../components/AddPersonModal';
import { LayoutGrid, List, Search, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Person {
  id: number;
  name: string;
  description: string;
  votes: number;
  category: string;
  created_at: string;
}

const categories = [
  { value: "todos", label: "Todos" },
  { value: "politica", label: "Política" },
  { value: "desporto", label: "Desporto" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "outro", label: "Outro" }
];

const Index = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [showRecent, setShowRecent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    const { data, error } = await supabase
      .from('people')
      .select('*');
    
    if (error) {
      console.error('Error fetching people:', error);
      return;
    }

    setPeople(data || []);
  };

  const handleVote = async (id: number) => {
    // Get client IP for vote tracking
    const response = await fetch('https://api.ipify.org?format=json');
    const { ip } = await response.json();

    // Try to insert vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert([{ person_id: id, user_ip: ip }]);

    if (voteError) {
      if (voteError.code === '23505') { // Unique violation
        toast({
          title: "Já votou nesta pessoa",
          description: "Apenas pode votar uma vez por pessoa.",
          variant: "destructive"
        });
        return;
      }
      console.error('Error voting:', voteError);
      return;
    }

    // Increment vote count
    const { error: updateError } = await supabase
      .from('people')
      .update({ votes: people.find(p => p.id === id)?.votes! + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating votes:', updateError);
      return;
    }

    // Update local state
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === id
          ? { ...person, votes: person.votes + 1 }
          : person
      ).sort((a, b) => b.votes - a.votes)
    );

    toast({
      title: "Voto registado",
      description: "O seu voto foi contabilizado com sucesso."
    });
  };

  const handleAddPerson = async ({ name, description, category }: { name: string; description: string; category: string }) => {
    const { data, error } = await supabase
      .from('people')
      .insert([{ name, description, category, votes: 0 }])
      .select()
      .single();

    if (error) {
      console.error('Error adding person:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a pessoa.",
        variant: "destructive"
      });
      return;
    }

    setPeople(current => [...current, data].sort((a, b) => b.votes - a.votes));
    toast({
      title: "Sucesso",
      description: "Pessoa adicionada com sucesso."
    });
  };

  const filteredPeople = [...people]
    .filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "todos" || person.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (showRecent) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.votes - a.votes;
    });

  return <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">Palácio da Vergonha</h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Vote nas figuras mais controversas de Portugal
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-grow">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Procurar por nome..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Badge
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              variant={showRecent ? "default" : "outline"}
              onClick={() => setShowRecent(!showRecent)}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Recentes
            </Button>
            <AddPersonModal onAdd={handleAddPerson} />
            <ButtonGroup>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} className="px-3">
                <List className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} className="px-3">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
        
        <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col space-y-4"}>
          {filteredPeople.map(person => <PersonCard key={person.id} {...person} onVote={handleVote} layout={viewMode} />)}
        </div>
      </div>
    </div>;
};

export default Index;
