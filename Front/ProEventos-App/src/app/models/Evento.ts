
import { RedeSocial } from "./RedeSocial";
import { Palestrante } from "./palestrante";
import { Lote } from "./Lote";
export interface Evento {

   id: number;
   local: string;
   dataEvento?: Date;
   tema: string;
   qtdPessoas: number;
   imageURL: string;
   telefone: string;
   email: string;
   lotes: Lote[];
   redesSociais: RedeSocial[];
   palestrantesEventos: Palestrante[];
}
