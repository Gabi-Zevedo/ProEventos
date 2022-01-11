import { RedeSocialService } from './../../services/redeSocial.service';
import { RedeSocial } from './../../models/RedeSocial';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.scss'],
})
export class RedesSociaisComponent implements OnInit {
  modalRef: BsModalRef;
  @Input() eventoId = 0;
  public form: FormGroup;
  public redeSocialAtual = { id: 0, nome: '', indice: 0 };

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private redeSocialService: RedeSocialService
  ) {}

  ngOnInit(): void {
      this.carregarRedesSociais(this.eventoId);
      console.log(this.eventoId);

    this.validation();
  }

  private carregarRedesSociais(id: number = 0): void {
    let origem = 'palestrante';

    if (this.eventoId !== 0) origem = 'evento';

    this.spinner.show();

    this.redeSocialService.getRedesSociais(origem, id).subscribe(
      (redeSocialRetorno: RedeSocial[]) => {
        redeSocialRetorno.forEach((redeSocial) => {
          this.redesSociais.push(this.criarRedeSocial(redeSocial));
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar Redes Sociais', 'ERRO!');
        console.error(error);
      }
    );
  }

  validation(): void {
    this.form = this.fb.group({
      redesSociais: this.fb.array([]),
    });
  }

  get redesSociais(): FormArray {
    return this.form.get('redesSociais') as FormArray;
  }

  public adicionarRedeSocial(): void {
    this.redesSociais.push(this.criarRedeSocial({ id: 0 } as RedeSocial));
  }

  public criarRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required],
    });
  }

  public tituloRedeSocial(nome: string): string {
    return nome === null || nome === '' ? 'Rede Social' : nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarRedesSociais(): void {
    let origem = 'palestrante';

    if (this.eventoId !== 0) origem = 'evento';

    if (this.form.controls.redesSociais.valid) {
      this.spinner.show();
      this.redeSocialService
        .saveRedesSociais(origem, this.eventoId, this.form.value.redesSociais)
        .subscribe(
          () => {
            this.toastr.success(
              'Redes Sociais Salvas com Sucesso',
              'Great Sucess'
            );
          },
          (error: any) => {
            this.toastr.error('Erro ao Salvar Redes Sociais', 'Erro!');
            console.error(Error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void {
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id').value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome').value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteRedeSocial(): void {
    let origem = 'palestrante';
    this.modalRef.hide();
    this.spinner.show();
    if (this.eventoId !== 0) origem = 'evento';
    this.redeSocialService
      .deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
      .subscribe(
        () => {
          this.toastr.success(
            `"${this.redeSocialAtual.nome}" foi deletado com sucesso`,
            'Great Sucess'
          );
          this.redesSociais.removeAt(this.redeSocialAtual.indice);
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao Deletar - ${this.redeSocialAtual.id}`,
            'Erro!'
          );
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  declineDeleteRedeSocial(): void {
    this.modalRef.hide();
  }
}
