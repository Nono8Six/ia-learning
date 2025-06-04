import Image from "next/image";

export function ClientLogos() {
  // Array of client logos - using placeholder company names
  const clients = [
    { name: "TechCorp", logoUrl: "https://placehold.co/140x50/f5f5f5/666666?text=TechCorp" },
    { name: "InnoGroup", logoUrl: "https://placehold.co/140x50/f5f5f5/666666?text=InnoGroup" },
    { name: "DataSoft", logoUrl: "https://placehold.co/140x50/f5f5f5/666666?text=DataSoft" },
    { name: "FutureNet", logoUrl: "https://placehold.co/140x50/f5f5f5/666666?text=FutureNet" },
    { name: "SmartSys", logoUrl: "https://placehold.co/140x50/f5f5f5/666666?text=SmartSys" },
    { name: "GlobalAI", logoUrl: "https://placehold.co/140x50/f5f5f5/666666?text=GlobalAI" },
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-muted-foreground font-medium">
            Ils font confiance à notre expertise en IA
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {clients.map((client, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
              <Image 
                src={client.logoUrl} 
                alt={client.name} 
                width={140} 
                height={50} 
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}