import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public mostrarImagem: boolean = true;
  public larguraImagem: number = 100;
  public margemImagem: number = 2;
  public eventoId!: number;
  public eventoTema!: string;
  public pagination = {} as Pagination;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe((filterBy) => {
      this.spinner.show();
        this.eventoService
          .getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filterBy,
          )
          .subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
            (error: any) => {
              this.toastr.error('Erro ao carregar eventos', 'ERROR');
            }
          )
          .add(() => this.spinner.hide());

      });
    }
    this.termoBuscaChanged.next(evt.value);
  }


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarEventos();
    //spinner no começo
  }

  public alterarImagem(): void {
    this.mostrarImagem = !this.mostrarImagem;
  }

  public imagem(imagemURL: String): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/semImagem.png';
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedEventos: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedEventos.result;
          this.pagination = paginatedEventos.pagination;
        },
        (error: any) => {
          this.toastr.error('Erro ao carregar eventos', 'ERROR');
        }
      )
      .add(() => this.spinner.hide());
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

  /**
   * pageChanged
   */
  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  confirm(eventoTema: string): void {
    this.modalRef?.hide();
    this.spinner.show;
    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success(
              `${eventoTema} Deletado Com sucesso`,
              'Deletado!'
            );
            this.carregarEventos();
          }
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao deletar evento ${this.eventoId} - "${this.eventoTema}"`,
            'Erro!'
          );
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
