import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold font-heading text-primary">
            Welcome
          </h1>
          <p className="text-lg text-secondary">
            Portfolio of Itumeleng Phalafala
          </p>
          <div className="bg-primary text-white px-6 py-3 rounded-lg inline-block">
            Tailwind CSS Configured
          </div>
        </div>
      </div>
      <Contact />
    </main>
  );
}
