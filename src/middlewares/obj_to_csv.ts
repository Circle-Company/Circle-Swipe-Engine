type ObjectToCSVOptions = {
    header?: boolean;
    delimiter?: string;
  }
  
export default function objectToCSV(data: any[], options?: ObjectToCSVOptions): string {
    // Opções padrão
    const defaultOptions: ObjectToCSVOptions = {
      header: true,
      delimiter: ','
    };
  
    // Mescla as opções fornecidas com as opções padrão
    const mergedOptions = { ...defaultOptions, ...options };
  
    // Extração das chaves dos objetos
    const keys = Object.keys(data[0]);
  
    // Criação do cabeçalho CSV
    const header = keys.join(mergedOptions.delimiter);
  
    // Criação das linhas de dados CSV
    const rows = data.map(obj => keys.map(key => obj[key]).join(mergedOptions.delimiter));
  
    // Combinação do cabeçalho e das linhas
    const csvContent = [header, ...rows].join('\n');
  
    return csvContent;
}