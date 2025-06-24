import { Categoria } from "./categoria";

export interface Filme {
  id: number;
  title: string;
  categoryId: number;
  userId: number;

  // Relacionamentos opcionais (como no JsonIgnore)
  category?: Categoria;
}