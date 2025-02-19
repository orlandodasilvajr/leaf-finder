
import CNPJSearch from "@/components/CNPJSearch";

const Index = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Consulta de CNPJ
        </h1>
        <CNPJSearch />
      </div>
    </div>
  );
};

export default Index;
