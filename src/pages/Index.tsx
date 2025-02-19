
import { useState } from 'react';
import PersonCard from '../components/PersonCard';
import AddPersonModal from '../components/AddPersonModal';
import { LayoutGrid, List, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Person {
  id: number;
  name: string;
  description: string;
  votes: number;
  category: string;
  createdAt: Date;
}

const initialPeople: Person[] = [{
  id: 1,
  name: "Fernando Santos",
  description: "Ex-selecionador nacional que deixou Ronaldo no banco.",
  votes: 45,
  category: "desporto",
  createdAt: new Date(2024, 1, 15)
}, {
  id: 2,
  name: "Luís Filipe Vieira",
  description: "Ex-presidente do Benfica envolvido em polémicas financeiras.",
  votes: 67,
  category: "desporto",
  createdAt: new Date(2024, 1, 14)
}, {
  id: 3,
  name: "Bruno de Carvalho",
  description: "Ex-presidente do Sporting conhecido por gestão controversa.",
  votes: 89,
  category: "desporto",
  createdAt: new Date(2024, 1, 13)
}];

const categories = [
  { value: "todos", label: "Todos" },
  { value: "politica", label: "Política" },
  { value: "desporto", label: "Desporto" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "outro", label: "Outro" }
];

const Index = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const handleVote = (id: number) => {
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === id
          ? { ...person, votes: person.votes + 1 }
          : person
      ).sort((a, b) => b.votes - a.votes)
    );
  };

  const handleAddPerson = ({ name, description, category }: { name: string; description: string; category: string }) => {
    const newPerson: Person = {
      id: Math.max(...people.map(p => p.id)) + 1,
      name,
      description,
      votes: 0,
      category,
      createdAt: new Date()
    };
    setPeople(current => [...current, newPerson].sort((a, b) => b.votes - a.votes));
  };

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || person.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPeople = [...people]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">Palácio da Vergonha</h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Vote nas figuras mais controversas de Portugal
          </p>
        </div>

        {recentPeople.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Adições Recentes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentPeople.map(person => (
                <PersonCard key={person.id} {...person} onVote={handleVote} layout="grid" />
              ))}
            </div>
          </div>
        )}

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
