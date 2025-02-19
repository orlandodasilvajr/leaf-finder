
import { useState } from "react";
import InputMask from "react-input-mask";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface CompanyData {
  empresa: {
    razaoSocial: string;
    porte: string;
    capitalSocial: string;
  };
  estabelecimento: {
    nomeFantasia: string;
  };
  natureza: {
    descricao: string;
  };
  municipio: {
    nome: string;
  };
  cnaePrincipal: {
    descricao: string;
  };
}

const CNPJSearch = () => {
  const [cnpj, setCNPJ] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["company", searchTrigger],
    queryFn: async () => {
      if (!searchTrigger) return null;
      const response = await fetch(
        `https://api.ianraphael.com.br/empresas/${searchTrigger}/perfil/`
      );
      if (!response.ok) {
        throw new Error("Empresa não encontrada");
      }
      return response.json() as Promise<CompanyData>;
    },
    enabled: !!searchTrigger,
    retry: false,
  });

  const handleSearch = () => {
    if (!cnpj) {
      toast.error("Por favor, insira um CNPJ");
      return;
    }
    const cleanCNPJ = cnpj.replace(/\D/g, "");
    if (cleanCNPJ.length !== 14) {
      toast.error("CNPJ inválido");
      return;
    }
    setSearchTrigger(cleanCNPJ);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <InputMask
            mask="99.999.999/9999-99"
            value={cnpj}
            onChange={(e) => setCNPJ(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="00.000.000/0001-91"
          >
            {(inputProps: any) => <Input {...inputProps} />}
          </InputMask>
        </div>
        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Buscando..." : "Buscar Empresa"}
        </Button>
      </div>

      {error ? (
        <div className="text-red-500 text-center p-4">
          Erro ao buscar dados da empresa
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : null}

      {data ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Razão Social</TableCell>
                <TableCell>{data.empresa.razaoSocial}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nome Fantasia</TableCell>
                <TableCell>{data.estabelecimento.nomeFantasia || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Porte</TableCell>
                <TableCell>{data.empresa.porte}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Capital Social</TableCell>
                <TableCell>{data.empresa.capitalSocial}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Natureza</TableCell>
                <TableCell>{data.natureza.descricao}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Município</TableCell>
                <TableCell>{data.municipio.nome}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CNAE Principal</TableCell>
                <TableCell>{data.cnaePrincipal.descricao}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : null}
    </Card>
  );
};

export default CNPJSearch;
