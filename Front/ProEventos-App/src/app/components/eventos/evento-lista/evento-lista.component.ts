import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public mostrarImagem: boolean = true;
  public larguraImagem: number = 100;
  public margemImagem: number = 2;
  public eventoId!: number;
  public eventoTema!: string;
  private _filtroLista: string = '';

  public get filtroLista() {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  /**
   *
   */
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
    //spinner no começo
  }

  public alterarImagem(): void {
    this.mostrarImagem = !this.mostrarImagem;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar eventos', 'ERROR');
      },

    ).add(() => this.spinner.hide());
  }

  openModal(
    event: any,
    template: TemplateRef<any>,
    eventoId: number,
    eventoTema: string
  ) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.eventoTema = eventoTema;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(eventoTema: string): void {
    this.modalRef?.hide();
    this.spinner.show;
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if (result.message === 'Deletado') {
          this.toastr.success(
            `${eventoTema} Deletado Com sucesso`,
            'Deletado!'
          );
          this.getEventos();
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao deletar evento ${this.eventoId} - "${this.eventoTema}"`, 'Erro!');
        console.error(error);
      },
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
