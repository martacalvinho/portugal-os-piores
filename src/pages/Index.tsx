import { useState } from 'react';
import PersonCard from '../components/PersonCard';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
interface Person {
  id: number;
  name: string;
  description: string;
  votes: number;
}
const initialPeople: Person[] = [{
  id: 1,
  name: "Fernando Santos",
  description: "Ex-selecionador nacional que deixou Ronaldo no banco.",
  votes: 45
}, {
  id: 2,
  name: "Luís Filipe Vieira",
  description: "Ex-presidente do Benfica envolvido em polémicas financeiras.",
  votes: 67
}, {
  id: 3,
  name: "Bruno de Carvalho",
  description: "Ex-presidente do Sporting conhecido por gestão controversa.",
  votes: 89
}];
const Index = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const handleVote = (id: number) => {
    setPeople(currentPeople => currentPeople.map(person => person.id === id ? {
      ...person,
      votes: person.votes + 1
    } : person).sort((a, b) => b.votes - a.votes));
  };
  return <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">Os Mais Amados...</h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Vote nas figuras mais controversas de Portugal
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <ButtonGroup>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} className="px-3">
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} className="px-3">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
        
        <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col space-y-4"}>
          {people.map(person => <PersonCard key={person.id} {...person} onVote={handleVote} layout={viewMode} />)}
        </div>
      </div>
    </div>;
};
export default Index;