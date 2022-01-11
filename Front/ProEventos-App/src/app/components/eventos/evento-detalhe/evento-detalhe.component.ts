import { environment } from './../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Lote } from './../../../models/Lote';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { LoteService } from 'src/app/services/lote.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  form!: FormGroup;
  evento = {} as Evento;
  lote = {} as Lote;
  estadoSalvar = 'post';
  eventoId!: number;
  modalRef: BsModalRef;
  loteAtual = {id: 0, nome: '', indice: 0};
  imagemURL = 'assets/upload.png';
  file: File;

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  /**
   * carregarEvento
   */
  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe(
          (evento: Evento) => {
            this.evento = { ...evento };
            this.form.patchValue(this.evento);
            if (this.evento.imageURL !== '') {
              this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imageURL;
            }
            //this.carregarLotes();
            this.evento.lotes.forEach((lote) => {this.lotes.push(this.criarLote(lote));
            });
          },
          (error: any) => {
            this.toastr.error('Erro ao Carregar Evento', 'Erro!');
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void {
    this.loteService
      .getLotesByEventoId(this.eventoId)
      .subscribe(
        (lotesRetorno: Lote[]) => {
          lotesRetorno.forEach((lote) => {this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any) => {
          this.toastr.error('Erro ao Carregar Lotes', 'Erro!');
          console.error(error);}
      )
      .add(() => this.spinner.hide());
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public tituloLote(nome: string): string{

    return nome === null ||nome === '' ? 'Lote': nome
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
      imageURL: [''],
      lotes: this.fb.array([]),
    });
  }

  public adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  public criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
    this.router.navigate(['eventos/lista']);
  }

  public resetFormLotes(event: any): void{
    event.preventDefault();
    this.form.reset();
    this.carregarLotes();
  }

  onSubimit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  /**
   * cssValidator
 : void  */
  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  /**
   * salvarEvento
   */
  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success(
            `${this.evento.tema} foi Salvo com Sucesso`,
            'Great Sucess'
          );
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          this.estadoSalvar = 'put';
        },
        (error: any) => {
          console.error(Error);
          this.spinner.hide();
          this.toastr.error('Erro ao Salvar Evento', 'Erro!');
        },
        () => this.spinner.hide()
      );
    }
  }

  /**
   * salvarLote
 :*/
  public salvarLote(): void {
    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService
        .saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success(' Lotes Salvos com Sucesso',
              'Great Sucess'
            );
          },
          (error: any) => {
            this.toastr.error('Erro ao Salvar Lote', 'Erro!');
            console.error(Error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void{

    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    //this.lotes.removeAt(indice);
  }

  confirmDeleteLote(): void{
this.modalRef.hide();
this.spinner.show();

this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(() => {
  this.toastr.success( `"${this.loteAtual.nome}" foi deletado com sucesso`, 'Great Sucess');
  this.lotes.removeAt(this.loteAtual.indice);
},
(error: any) => {
  this.toastr.error(`Erro ao Deletar Lote - ${this.loteAtual.id}`, 'Erro!');
  console.error(error);
}


).add(() => this.spinner.hide())

  }

  declineDeleteLote(): void{
    this.modalRef.hide();
  }


  onFileChange(event: any): void{
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = event.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void{
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(

      () => {
        this.carregarEvento();
        this.toastr.success( 'Imagem Atualizada com Sucesso', 'Great Sucess');
      },

      (error: any) => {
        this.toastr.error(`Erro ao Atualizar Imagem`, 'Erro!');
        console.error(Error);
      }


      ).add(() => this.spinner.hide())



  }

}
