export interface AlertaStock {
  id: number;
  nombre: string;
  sku: string;
  stock_actual: number;
  stock_minimo: number;
  diferencia: number;
}