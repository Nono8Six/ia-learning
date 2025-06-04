"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Sector,
  RadialBarChart,
  RadialBar,
  Label,
  LabelList
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  Users, 
  Building2, 
  Brain, 
  Factory, 
  ShoppingBag, 
  Briefcase, 
  BookOpen, 
  Globe,
  Zap,
  Clock
} from "lucide-react";

export function AIGrowthCharts() {
  const [activeTab, setActiveTab] = useState("marché");
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Initialize component on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Market data - Croissance du marché mondial de l'IA
  const marketGrowthData: { year: string; value: number }[] = [
    { year: "2022", value: 150 },
    { year: "2023", value: 220 },
    { year: "2024", value: 330 },
    { year: "2025", value: 450 },
    { year: "2026", value: 620 },
    { year: "2027", value: 850 },
    { year: "2028", value: 1200 },
    { year: "2029", value: 1600 },
    { year: "2030", value: 1900 }
  ];

  // Impact économique par région
  const economicImpactData: { name: string; value: number }[] = [
    { name: "Amérique du Nord", value: 3600 },
    { name: "Europe", value: 2800 },
    { name: "Chine", value: 3200 },
    { name: "Reste de l'Asie", value: 1900 },
    { name: "Amérique Latine", value: 850 },
    { name: "Afrique et Moyen-Orient", value: 550 }
  ];

  // Sectors data - Distribution de l'IA par secteur
  const sectorDistributionData: { name: string; value: number }[] = [
    { name: "Santé", value: 24 },
    { name: "Finance", value: 21 },
    { name: "Retail", value: 16 },
    { name: "Industrie", value: 14 },
    { name: "Transport", value: 10 },
    { name: "Éducation", value: 8 },
    { name: "Autre", value: 7 }
  ];
  
  // Croissance par secteur (%)
  const sectorGrowthData: { sector: string; growth: number }[] = [
    { sector: "Santé", growth: 42 },
    { sector: "Finance", growth: 38 },
    { sector: "Retail", growth: 35 },
    { sector: "Industrie", growth: 33 },
    { sector: "Transport", growth: 30 },
    { sector: "Éducation", growth: 28 },
    { sector: "Autre", growth: 24 }
  ];
  
  // Investissements mondiaux en IA par secteur (milliards $)
  const sectorInvestmentData: { sector: string; value: number }[] = [
    { sector: "Santé", value: 43.2 },
    { sector: "Finance", value: 38.6 },
    { sector: "Retail", value: 28.5 },
    { sector: "Industrie", value: 25.7 },
    { sector: "Transport", value: 19.2 },
    { sector: "Éducation", value: 12.8 },
    { sector: "Autre", value: 14.3 }
  ];

  // Productivity data - Gain de productivité moyen par cas d'usage
  const productivityGainData: { useCase: string; gain: number }[] = [
    { useCase: "Automatisation des processus", gain: 48 },
    { useCase: "Analyse de données", gain: 42 },
    { useCase: "Génération de contenu", gain: 39 },
    { useCase: "Service client", gain: 35 },
    { useCase: "R&D", gain: 30 },
    { useCase: "Recrutement", gain: 28 },
    { useCase: "Marketing", gain: 25 }
  ];
  
  // Économies de temps hebdomadaires par profession (heures)
  const timeSavingsData: { profession: string; value: number }[] = [
    { profession: "Marketing", value: 12.5 },
    { profession: "Finance", value: 9.8 },
    { profession: "Juridique", value: 8.7 },
    { profession: "RH", value: 7.5 },
    { profession: "Ingénierie", value: 6.8 },
    { profession: "Ventes", value: 6.2 },
    { profession: "Créatif", value: 5.5 }
  ];
  
  // Évolution du ROI des projets IA (%)
  const roiEvolutionData: { year: string; roi: number }[] = [
    { year: "2020", roi: 125 },
    { year: "2021", roi: 168 },
    { year: "2022", roi: 205 },
    { year: "2023", roi: 260 },
    { year: "2024", roi: 310 },
    { year: "2025", roi: 380 }
  ];

  // Employment data - Création d'emplois vs. Automatisation
  const jobsData: { year: string; created: number; automated: number }[] = [
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
  
  // Top 5 compétences IA les plus demandées (indice de demande)
  const skillsDemandData: { skill: string; value: number }[] = [
    { skill: "Prompt Engineering", value: 95 },
    { skill: "Data Analysis", value: 90 },
    { skill: "LLM Fine-tuning", value: 85 },
    { skill: "IA Éthique", value: 80 },
    { skill: "Automatisation IA", value: 75 }
  ];
  
  // Estimation de nouveaux métiers créés par l'IA
  const newJobsData: { category: string; value: number }[] = [
    { category: "IA Gouvernance", value: 320 },
    { category: "Prompt Engineering", value: 280 },
    { category: "IA Éthique", value: 240 },
    { category: "IA Training", value: 210 },
    { category: "IA Support", value: 180 },
    { category: "Autres", value: 150 }
  ];

  // Colors for charts
  const COLORS = [
    "hsl(var(--chart-1))", 
    "hsl(var(--chart-2))", 
    "hsl(var(--chart-3))", 
    "hsl(var(--chart-4))", 
    "hsl(var(--chart-5))",
    "hsl(260, 70%, 50%)",
    "hsl(180, 60%, 45%)"
  ];
  
  // Hover animation for pie charts
  const renderActiveShape = (props: any) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="drop-shadow-lg"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 14}
          outerRadius={outerRadius + 16}
          fill={fill}
          className="drop-shadow-md"
        />
        <text 
          x={cx} 
          y={cy} 
          dy={-20} 
          textAnchor="middle" 
          fill="currentColor"
          className="text-lg font-semibold"
        >
          {payload.name}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={8} 
          textAnchor="middle" 
          fill="currentColor"
          className="text-lg font-bold"
        >
          {value}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={28} 
          textAnchor="middle" 
          fill="currentColor"
          className="text-sm"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Custom tooltip for better design
  const CustomTooltip = ({ active, payload, label, valuePrefix, valueSuffix }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/40 p-3 rounded-md shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm mt-1">
              {entry.name}: {valuePrefix || ""}{entry.value.toLocaleString()}{valueSuffix || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isMounted) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Statistiques du marché de l'IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Chargement des données...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-animated py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Statistiques du marché de l'IA
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explorez les dernières données sur la croissance et l'impact de l'intelligence artificielle dans différents secteurs.
          </p>
          
          <div className="inline-flex p-1 bg-muted/70 rounded-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full p-1 gap-1 bg-transparent">
                <TabsTrigger 
                  value="marché" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-2"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Marché</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="secteurs" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-2"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Secteurs</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="productivité" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-2"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Productivité</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="emplois" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-2"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Emplois</span>
                </TabsTrigger>
              </TabsList>
            
              {/* Market Tab Content */}
              <TabsContent value="marché" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Market Growth Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <TrendingUp className="h-5 w-5 mr-2 text-chart-1" />
                        Croissance du marché mondial de l'IA
                      </CardTitle>
                      <CardDescription>Évolution 2022-2030 (en milliards de dollars)</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            data={marketGrowthData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                            className="chart-animated"
                          >
                            <defs>
                              <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="year" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                            />
                            <YAxis 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[0, 2000]}
                              tickCount={6}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix=" milliards $" />} />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--chart-1))" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorMarket)" 
                              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--chart-1))" }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Taux de croissance annuel</div>
                            <div className="text-2xl font-bold text-chart-1">+37%</div>
                          </div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Marché en 2025</div>
                            <div className="text-2xl font-bold">382 milliards $</div>
                          </div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Multiplication d'ici 2030</div>
                            <div className="text-2xl font-bold">×13</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Economic Impact by Region */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <Globe className="h-5 w-5 mr-2 text-chart-1" />
                        Impact économique par région
                      </CardTitle>
                      <CardDescription>Valeur ajoutée d'ici 2030 (en milliards de dollars)</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={economicImpactData}
                            margin={{ top: 10, right: 30, left: 60, bottom: 30 }}
                            className="chart-animated"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              type="number"
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[0, 4000]}
                              tickCount={5}
                            />
                            <YAxis 
                              dataKey="name" 
                              type="category"
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              width={120}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix=" milliards $" />} />
                            <Bar 
                              dataKey="value" 
                              fill="hsl(var(--chart-1))" 
                              barSize={30} 
                              radius={[0, 4, 4, 0]}
                            >
                              {economicImpactData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-6 text-center p-4 bg-muted/40 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Impact économique mondial total estimé:</div>
                        <div className="text-2xl font-bold">12 900 milliards $</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Sectors Tab Content */}
              <TabsContent value="secteurs" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sector Distribution Pie Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <PieChartIcon className="h-5 w-5 mr-2 text-chart-1" />
                        Distribution de l'IA par secteur
                      </CardTitle>
                      <CardDescription>Pourcentage d'adoption par industrie</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart className="chart-animated">
                            <Pie
                              activeIndex={hoveredIndex ?? undefined}
                              activeShape={renderActiveShape}
                              data={sectorDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              dataKey="value"
                              onMouseEnter={(_, index) => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(null)}
                            >
                              {sectorDistributionData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                  className="drop-shadow-md hover:drop-shadow-xl transition-all"
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Sector Growth Bar Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <TrendingUp className="h-5 w-5 mr-2 text-chart-1" />
                        Croissance par secteur
                      </CardTitle>
                      <CardDescription>Taux de croissance annuel composé (%)</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={sectorGrowthData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                            className="chart-animated"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="sector" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                            />
                            <YAxis 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[0, 50]}
                              tickCount={6}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                            <Bar 
                              dataKey="growth" 
                              fill="hsl(var(--chart-1))" 
                              barSize={40} 
                              radius={[4, 4, 0, 0]}
                            >
                              {sectorGrowthData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                />
                              ))}
                              <LabelList dataKey="growth" position="top" formatter={(value: any) => `${value}%`} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Sector Investment Radar Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <BarChartIcon className="h-5 w-5 mr-2 text-chart-1" />
                        Investissements mondiaux en IA par secteur
                      </CardTitle>
                      <CardDescription>En milliards de dollars</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            data={sectorInvestmentData}
                            className="chart-animated"
                          >
                            <PolarGrid stroke="currentColor" strokeOpacity={0.2} />
                            <PolarAngleAxis 
                              dataKey="sector" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 50]} 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <Radar 
                              name="Investissements" 
                              dataKey="value" 
                              stroke="hsl(var(--chart-1))" 
                              fill="hsl(var(--chart-1))" 
                              fillOpacity={0.6} 
                            />
                            <Tooltip content={<CustomTooltip valueSuffix=" milliards $" />} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Productivity Tab Content */}
              <TabsContent value="productivité" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Productivity Gain Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <Zap className="h-5 w-5 mr-2 text-chart-1" />
                        Gain de productivité moyen par cas d'usage
                      </CardTitle>
                      <CardDescription>Pourcentage d'augmentation de productivité</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={productivityGainData}
                            margin={{ top: 10, right: 30, left: 120, bottom: 30 }}
                            className="chart-animated"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              type="number"
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[0, 50]}
                              tickCount={6}
                            />
                            <YAxis 
                              dataKey="useCase" 
                              type="category"
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              width={120}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                            <Bar 
                              dataKey="gain" 
                              fill="hsl(var(--chart-2))" 
                              barSize={30} 
                              radius={[0, 4, 4, 0]}
                            >
                              <LabelList dataKey="gain" position="right" formatter={(value: any) => `${value}%`} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Time Savings Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <Clock className="h-5 w-5 mr-2 text-chart-1" />
                        Économies de temps hebdomadaires par profession
                      </CardTitle>
                      <CardDescription>En heures par semaine</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={timeSavingsData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                            className="chart-animated"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="profession" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                            />
                            <YAxis 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[0, 15]}
                              tickCount={6}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix=" heures" />} />
                            <Bar 
                              dataKey="value" 
                              fill="hsl(var(--chart-3))" 
                              barSize={40} 
                              radius={[4, 4, 0, 0]}
                            >
                              <LabelList dataKey="value" position="top" formatter={(value: any) => `${value}h`} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* ROI Evolution Line Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <TrendingUp className="h-5 w-5 mr-2 text-chart-1" />
                        Évolution du ROI des projets IA
                      </CardTitle>
                      <CardDescription>Retour sur investissement moyen (%)</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={roiEvolutionData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                            className="chart-animated"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="year" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                            />
                            <YAxis 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[100, 400]}
                              tickCount={6}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix="%" />} />
                            <Line 
                              type="monotone" 
                              dataKey="roi" 
                              stroke="hsl(var(--chart-4))" 
                              strokeWidth={3}
                              dot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--chart-4))" }}
                              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--chart-4))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Employment Tab Content */}
              <TabsContent value="emplois" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Jobs Created vs Automated */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <Briefcase className="h-5 w-5 mr-2 text-chart-1" />
                        Création d'emplois vs. Automatisation
                      </CardTitle>
                      <CardDescription>En millions d'emplois, prévision 2022-2030</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={jobsData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                            className="chart-animated"
                          >
                            <defs>
                              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorAutomated" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis 
                              dataKey="year" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                            />
                            <YAxis 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                              tickMargin={10}
                              axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                              domain={[0, 6]}
                              tickCount={7}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix=" millions" />} />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="created" 
                              name="Emplois créés"
                              stroke="hsl(var(--chart-1))" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorCreated)" 
                              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--chart-1))" }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="automated" 
                              name="Emplois automatisés"
                              stroke="hsl(var(--chart-3))" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorAutomated)" 
                              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--chart-3))" }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Net gain d'emplois</div>
                            <div className="text-2xl font-bold text-chart-1">+3 millions</div>
                          </div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Ratio création/automatisation</div>
                            <div className="text-2xl font-bold">2.2:1</div>
                          </div>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">Croissance annuelle d'emplois</div>
                            <div className="text-2xl font-bold">+24%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Skills Demand Radar Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <Brain className="h-5 w-5 mr-2 text-chart-1" />
                        Top 5 compétences IA les plus demandées
                      </CardTitle>
                      <CardDescription>Indice de demande sur 100</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            data={skillsDemandData}
                            className="chart-animated"
                          >
                            <PolarGrid stroke="currentColor" strokeOpacity={0.2} />
                            <PolarAngleAxis 
                              dataKey="skill" 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <PolarRadiusAxis 
                              angle={90} 
                              domain={[0, 100]} 
                              tick={{ fill: 'currentColor', fontSize: 12 }}
                            />
                            <Radar 
                              name="Demande" 
                              dataKey="value" 
                              stroke="hsl(var(--chart-5))" 
                              fill="hsl(var(--chart-5))" 
                              fillOpacity={0.6} 
                            />
                            <Tooltip content={<CustomTooltip valueSuffix="/100" />} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* New Jobs Radial Bar Chart */}
                  <Card className="border border-border/50 overflow-hidden shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-xl">
                        <Briefcase className="h-5 w-5 mr-2 text-chart-1" />
                        Estimation de nouveaux métiers créés par l'IA
                      </CardTitle>
                      <CardDescription>En milliers d'emplois d'ici 2030</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="20%" 
                            outerRadius="90%" 
                            barSize={20} 
                            data={newJobsData}
                            startAngle={180} 
                            endAngle={-180}
                            className="chart-animated"
                          >
                            <RadialBar
                              label={{ position: 'insideStart', fill: 'currentColor', fontSize: 12 }}
                              background
                              dataKey="value"
                            >
                              {newJobsData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                />
                              ))}
                            </RadialBar>
                            <Legend 
                              iconSize={10} 
                              layout="vertical" 
                              verticalAlign="middle" 
                              wrapperStyle={{ right: 0, top: 0, bottom: 0 }}
                            />
                            <Tooltip content={<CustomTooltip valueSuffix="k" />} />
                            <PolarAngleAxis
                              type="number"
                              domain={[0, 400]}
                              dataKey={'value'}
                              angleAxisId={0}
                              tick={false}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}