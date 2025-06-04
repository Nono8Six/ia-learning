"use client";

import { Brain, TrendingUp, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  index: number;
};

function StatCard({ icon, value, label, index }: StatProps) {
  return (
    <Card 
      className={`section-animated stagger-item-${index + 1} border-border/50`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10 mt-1">
            {icon}
          </div>
          <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatisticsSection() {
  const stats = [
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      value: "37%",
      label: "Croissance annuelle du marché de l'IA"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      value: "97%",
      label: "Des entreprises cherchent des experts en IA"
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      value: "5-50x",
      label: "Gain de productivité grâce à l'IA"
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      value: "1,8M",
      label: "Emplois créés d'ici 2026"
    }
  ];

  return (
    <section 
      className="section-animated py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Le marché de l'IA en pleine expansion
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            L'intelligence artificielle transforme rapidement tous les secteurs d'activité, 
            créant une forte demande pour les professionnels formés.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}