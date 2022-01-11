import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PalestranteService } from './../../../services/palestrante.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Palestrante } from '@app/models/palestrante';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss'],
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public formStatus = '';
  public statusCollor = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.validation();
    this.formVerifier();
    this.carregarPalestrante();
  }

  private carregarPalestrante(): void {
    this.spinner.show();
    this.palestranteService.getPalestrante().subscribe(
      (palestrante: Palestrante) => {
        this.form.patchValue(palestrante);
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar o palestrante', 'ERRO!');
        console.log(error);
      }
    );
  }

  private validation(): void {
    this.form = this.fb.group({
      miniCurriculo: [''],
    });
  }

  private formVerifier(): void {
    this.form.valueChanges
      .pipe(
        map(() => {
          this.formStatus = 'Atualizando...';
          this.statusCollor = 'text-warning';
        }),
        debounceTime(1000),
        tap(() => this.spinner.show())
      )
      .subscribe(() => {
        this.palestranteService
          .put({ ...this.form.value })
          .subscribe(
            () => {
              this.formStatus = 'Minicurrículo Atualizado';
              this.statusCollor = 'text-success';

              setTimeout(() => {
              this.formStatus = 'Minicurrículo em Dia';
              this.statusCollor = 'text-muted';
              }, 2000);

            },
            () => {
              this.formStatus = 'Falha ao Atualizar';
              this.statusCollor = 'text-danger';
            }
          )
          .add(() => this.spinner.hide());
      });
  }

  get f(): any {
    return this.form.controls;
  }
}
