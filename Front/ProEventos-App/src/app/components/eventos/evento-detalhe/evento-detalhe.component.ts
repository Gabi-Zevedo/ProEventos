import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  form!: FormGroup;
  evento = {} as Evento;
  estadoSalvar = 'post';

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  /**
   * carregarEvento
   */
  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar Evento', 'Erro!');
          console.error(error);
        },

        () => this.spinner.hide()
      );
    }
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageURL: ['', Validators.required],
    });
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  onSubimit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  /**
   * cssValidator
 : void  */
  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  /**
   * salvarAlteracao
   */
  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        () =>
          this.toastr.success(
            `${this.evento.tema} foi Salvo com Sucesso`,
            'Great Sucess'
          ),
        (error: any) => {
          console.error(Error);
          this.spinner.hide();
          this.toastr.error('Erro ao Salvar Evento', 'Erro!');
        },
        () => this.spinner.hide()
      );
    }
  }
}
