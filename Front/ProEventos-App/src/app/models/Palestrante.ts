import { UserUpdate } from './identity/UserUpdate';
import { Evento } from './Evento';
import { RedeSocial } from "./RedeSocial";

export interface Palestrante {

   id: number;
   miniCurriculo: string;
   user: UserUpdate;
   redesSociais: RedeSocial[];
   palestranteEventos: Evento[];
}
