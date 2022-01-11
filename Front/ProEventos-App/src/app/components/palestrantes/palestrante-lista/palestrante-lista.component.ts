import { Component, OnInit } from '@angular/core';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PalestranteService } from '@app/services/palestrante.service';
import { Palestrante } from '@app/models/palestrante';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss'],
})
export class PalestranteListaComponent implements OnInit {
  termoBuscaChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;
  public palestranteId = 0;
  public palestrantes: Palestrante[] = [];

  constructor(
    private palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarPalestrantes();
  }

  getImagem(imageName): string {
    return imageName
      ? environment.apiURL + `resources/perfil/${imageName}`
      : '../../../../assets/semImagemUser.png';
  }

  public carregarPalestrantes(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrantes(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (paginatedPalestrantes: PaginatedResult<Palestrante[]>) => {
          this.palestrantes = paginatedPalestrantes.result;
          this.pagination = paginatedPalestrantes.pagination;
        },
        (error: any) => {
          this.toastr.error('Erro ao carregar eventos', 'ERROR');
        }
      )
      .add(() => this.spinner.hide());
  }

  public filtrarPalestrantes(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe((filterBy) => {
        this.spinner.show();
        this.palestranteService
          .getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filterBy
          )
          .subscribe(
            (paginatedResult: PaginatedResult<Palestrante[]>) => {
              this.palestrantes = paginatedResult.result;
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
}
