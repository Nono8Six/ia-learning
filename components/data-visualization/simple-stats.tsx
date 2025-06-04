"use client";

import { useState, useEffect } from "react";
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart,
  Label
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, PieChart as PieChartIcon, Brain, Briefcase, Zap, Globe } from "lucide-react";

export function SimpleStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Données du marché mondial de l'IA (milliards de dollars)
  const marketData = [
    { year: "2022", value: 150 },
    { year: "2023", value: 220 },
    { year: "2024", value: 330 },
    { year: "2025", value: 450 },
    { year: "2026", value: 620 },
    { year: "2027", value: 850 },
    { year: "2028", value: 1200 },
    { year: "2029", value: 1600 },
    { year: "2030", value: 1811.75 }
  ];

  // Données du marché européen
  const europeMarketData = [
    { year: "2022", value: 48 },
    { year: "2023", value: 65 },
    { year: "2024", value: 95 },
    { year: "2025", value: 140 },
    { year: "2026", value: 190 },
    { year: "2027", value: 245 },
    { year: "2028", value: 300 },
    { year: "2029", value: 335 },
    { year: "2030", value: 370.3 }
  ];

  // Données sectorielles
  const sectorData = [
    { name: "Santé", value: 24 },
    { name: "Finance", value: 21 },
    { name: "Retail", value: 16 },
    { name: "Industrie", value: 14 },
    { name: "Transport", value: 10 },
    { name: "Éducation", value: 8 },
    { name: "Autre", value: 7 }
  ];

  // Croissance par secteur (%)
  const sectorGrowthData = [
    { sector: "Santé", growth: 42 },
    { sector: "Finance", growth: 38 },
    { sector: "Retail", growth: 35 },
    { sector: "Industrie", growth: 33 },
    { sector: "Transport", growth: 30 },
    { sector: "Éducation", growth: 28 },
    { sector: "Autre", growth: 24 }
  ];

  // Gain de productivité par domaine
  const productivityData = [
    { useCase: "Service client", gain: 45 },
    { useCase: "Finance", gain: 42 },
    { useCase: "Marketing", gain: 38 },
    { useCase: "RH", gain: 32 },
    { useCase: "R&D", gain: 30 }
  ];

  // Création vs Automatisation des emplois (millions)
  const jobsData = [
    { year: "2022", created: 0.8, automated: 0.4 },
    { year: "2023", created: 1.1, automated: 0.6 },
    { year: "2024", created: 1.5, automated: 0.8 },
    { year: "2025", created: 2.0, automated: 1.0 },
    { year: "2026", created: 2.6, automated: 1.2 },
    { year: "2027", created: 3.3, automated: 1.5 },
    { year: "2028", created: 4.0, automated: 1.8 },
    { year: "2029", created: 4.8, automated: 2.2 },
    { year: "2030", created: 5.5, automated: 2.5 }
  ];

  // ROI des projets IA (%)
  const roiData = [
    { year: "2020", roi: 125 },
    { year: "2021", roi: 168 },
    { year: "2022", roi: 205 },
    { year: "2023", roi: 260 },
    { year: "2024", roi: 310 },
    { year: "2025", roi: 380 }
  ];

  // Couleurs vives pour les graphiques
  const COLORS = [
    "#FF3B69", "#4285F4", "#34A853", "#FBBC05", "#8F44FD",
    "#00C9FF", "#FF5A5A", "#00E396", "#FEB019", "#775DD0"
  ];

  // Formatter pour les tooltips
  const CustomTooltip = ({ active, payload, label, valuePrefix, valueSuffix }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-background border border-border rounded-md shadow-lg">
          <p className="text-sm font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm mt-1">
              {entry.name}: {valuePrefix || ""}{entry.value.toLocaleString()}{valueSuffix || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Statistiques du marché de l'IA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Chargement des données...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Statistiques du marché de l'IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            L'Impératif de la Maîtrise Fondamentale de l'IA : Naviguer et Prospérer dans la Prochaine Vague de Transformation (2023-2030)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Graphique 1: Croissance du marché mondial */}
          <Card className="border border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#FF3B69]/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-5 w-5 mr-2 text-[#FF3B69]" />
                Croissance du marché mondial de l'IA
              </CardTitle>
              <CardDescription>Évolution 2022-2030 (en milliards de dollars)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={marketData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                  >
                    <defs>
                      <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF3B69" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF3B69" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 2000]}
                      tickCount={6}
                    >
                      <Label 
                        value="Milliards $" 
                        position="insideLeft" 
                        angle={-90} 
                        style={{ textAnchor: 'middle', fill: 'currentColor' }} 
                        offset={-5}
                      />
                    </YAxis>
                    <Tooltip content={<CustomTooltip valueSuffix=" Mrd $" />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name="Marché mondial" 
                      stroke="#FF3B69" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMarket)" 
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#FF3B69" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">TCAC</div>
                  <div className="text-xl font-bold text-[#FF3B69]">+35,9%</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">2030</div>
                  <div className="text-xl font-bold">1812 Mrd $</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">Croissance</div>
                  <div className="text-xl font-bold">×12,1</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Graphique 2: Marché européen */}
          <Card className="border border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#4285F4]/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center text-xl">
                <Globe className="h-5 w-5 mr-2 text-[#4285F4]" />
                Marché européen de l'IA
              </CardTitle>
              <CardDescription>Évolution 2022-2030 (en milliards de dollars)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={europeMarketData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                  >
                    <defs>
                      <linearGradient id="colorEuropeMarket" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4285F4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 400]}
                      tickCount={6}
                    >
                      <Label 
                        value="Milliards $" 
                        position="insideLeft" 
                        angle={-90} 
                        style={{ textAnchor: 'middle', fill: 'currentColor' }} 
                        offset={-5}
                      />
                    </YAxis>
                    <Tooltip content={<CustomTooltip valueSuffix=" Mrd $" />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name="Marché européen" 
                      stroke="#4285F4" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorEuropeMarket)" 
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#4285F4" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">TCAC</div>
                  <div className="text-xl font-bold text-[#4285F4]">+33,2%</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">2030</div>
                  <div className="text-xl font-bold">370 Mrd $</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">% du marché mondial</div>
                  <div className="text-xl font-bold">20,4%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Graphique 3: Distribution par secteur */}
          <Card className="border border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#34A853]/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center text-xl">
                <PieChartIcon className="h-5 w-5 mr-2 text-[#34A853]" />
                Distribution de l'IA par secteur
              </CardTitle>
              <CardDescription>Pourcentage d'adoption par industrie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      margin={{ top: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Graphique 4: Croissance par secteur */}
          <Card className="border border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FBBC05]/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-5 w-5 mr-2 text-[#FBBC05]" />
                Croissance par secteur
              </CardTitle>
              <CardDescription>Taux de croissance annuel composé (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sectorGrowthData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="sector" 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 50]}
                      tickCount={6}
                    >
                      <Label 
                        value="TCAC (%)" 
                        position="insideLeft" 
                        angle={-90} 
                        style={{ textAnchor: 'middle', fill: 'currentColor' }} 
                        offset={-5}
                      />
                    </YAxis>
                    <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                    <Bar 
                      dataKey="growth" 
                      name="Croissance" 
                      fill="#FBBC05" 
                      barSize={30} 
                      radius={[4, 4, 0, 0]}
                    >
                      {sectorGrowthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Graphique 5: Gain de productivité */}
          <Card className="border border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#8F44FD]/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center text-xl">
                <Zap className="h-5 w-5 mr-2 text-[#8F44FD]" />
                Gain de productivité moyen par domaine
              </CardTitle>
              <CardDescription>Pourcentage d'augmentation de productivité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={productivityData}
                    margin={{ top: 10, right: 30, left: 80, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      type="number"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 50]}
                      tickCount={6}
                    >
                      <Label 
                        value="Gain (%)" 
                        position="insideBottom" 
                        style={{ textAnchor: 'middle', fill: 'currentColor' }} 
                        offset={-10}
                      />
                    </XAxis>
                    <YAxis 
                      dataKey="useCase" 
                      type="category"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                    <Bar 
                      dataKey="gain" 
                      name="Augmentation" 
                      fill="#8F44FD" 
                      barSize={20} 
                      radius={[0, 4, 4, 0]}
                    >
                      <Label position="right" fill="currentColor" fontSize={12} />
                      {productivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 5) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 bg-muted/40 p-3 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Multiplication de productivité moyenne</div>
                <div className="text-xl font-bold">×5 à ×50 selon les métiers</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Graphique 6: Emplois IA */}
          <Card className="border border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#00C9FF]/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center text-xl">
                <Briefcase className="h-5 w-5 mr-2 text-[#00C9FF]" />
                Création d'emplois vs. Automatisation
              </CardTitle>
              <CardDescription>En millions d'emplois, prévision 2022-2030</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={jobsData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                  >
                    <defs>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C9FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00C9FF" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorAutomated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5A5A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF5A5A" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={10}
                      domain={[0, 6]}
                      tickCount={7}
                    >
                      <Label 
                        value="Millions d'emplois" 
                        position="insideLeft" 
                        angle={-90} 
                        style={{ textAnchor: 'middle', fill: 'currentColor' }} 
                        offset={-5}
                      />
                    </YAxis>
                    <Tooltip content={<CustomTooltip valueSuffix=" millions" />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="created" 
                      name="Emplois créés"
                      stroke="#00C9FF" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCreated)" 
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#00C9FF" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="automated" 
                      name="Emplois automatisés"
                      stroke="#FF5A5A" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAutomated)" 
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#FF5A5A" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">Gain net</div>
                  <div className="text-xl font-bold text-[#00C9FF]">+3 millions</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">Ratio création/auto</div>
                  <div className="text-xl font-bold">2.2:1</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-1">TCAC emplois</div>
                  <div className="text-xl font-bold">+24%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Graphique 7: ROI des projets IA */}
        <Card className="border border-border/50 overflow-hidden shadow-sm">
          <CardHeader className="pb-2 relative">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#00E396]/10 rounded-full blur-xl"></div>
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="h-5 w-5 mr-2 text-[#00E396]" />
              Évolution du ROI des projets IA
            </CardTitle>
            <CardDescription>Retour sur investissement moyen (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={roiData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickMargin={10}
                    domain={[100, 400]}
                    tickCount={6}
                  >
                    <Label 
                      value="ROI (%)" 
                      position="insideLeft" 
                      angle={-90} 
                      style={{ textAnchor: 'middle', fill: 'currentColor' }} 
                      offset={-5}
                    />
                  </YAxis>
                  <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                  <Line 
                    type="monotone" 
                    dataKey="roi" 
                    name="ROI" 
                    stroke="#00E396" 
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 0, fill: "#00E396" }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: "#00E396" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-muted/40 p-3 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">ROI moyen PME</div>
                <div className="text-xl font-bold text-[#00E396]">+215%</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Croissance ROI</div>
                <div className="text-xl font-bold">×3 en 5 ans</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">PME avec ROI &gt;150%</div>
                <div className="text-xl font-bold">72%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}