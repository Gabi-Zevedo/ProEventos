import { Evento } from "./Evento";
import { Palestrante } from "./palestrante";

export interface RedeSocial {
  id: number;
  nome: string;
  uRL: string;
  eventoId?: number;
  evento: Evento;
  palestranteId?: number;
  palestrante: Palestrante;
}
