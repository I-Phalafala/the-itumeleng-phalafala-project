export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
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
    </main>
  );
}
