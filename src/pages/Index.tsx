
import { useState } from 'react';
import PersonCard from '../components/PersonCard';

interface Person {
  id: number;
  name: string;
  description: string;
  votes: number;
}

const initialPeople: Person[] = [
  {
    id: 1,
    name: "Fernando Santos",
    description: "Ex-selecionador nacional que deixou Ronaldo no banco.",
    votes: 45
  },
  {
    id: 2,
    name: "Luís Filipe Vieira",
    description: "Ex-presidente do Benfica envolvido em polémicas financeiras.",
    votes: 67
  },
  {
    id: 3,
    name: "Bruno de Carvalho",
    description: "Ex-presidente do Sporting conhecido por gestão controversa.",
    votes: 89
  }
];

const Index = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);

  const handleVote = (id: number) => {
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === id
          ? { ...person, votes: person.votes + 1 }
          : person
      ).sort((a, b) => b.votes - a.votes)
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Portugal Mais Odiados
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Vote nas personalidades mais controversas de Portugal
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map(person => (
            <PersonCard
              key={person.id}
              {...person}
              onVote={handleVote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
