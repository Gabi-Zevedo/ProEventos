import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss'],
})
export class PerfilDetalheComponent implements OnInit {
  @Output() emitFormValue = new EventEmitter();
  form!: FormGroup;
  userUpdate = {} as UserUpdate;

  public get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.formVerifier();
  }

  private formVerifier(): void{
    this.form.valueChanges.subscribe(
      ()=>{this.emitFormValue.emit({... this.form.value})},

    )
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService
      .getUser()
      .subscribe(
        (userRetorno: UserUpdate) => {
          console.log(userRetorno);
          this.userUpdate = userRetorno;
          this.form.patchValue(this.userUpdate);
          this.toastr.success('Usuário carregado', 'Great Sucess');
        },
        (error: Error) => {
          console.error(error);
          this.toastr.error('Erro ao carregar usuário', 'Erro!');
          this.router.navigate(['/dashboard']);
        }
      )
      .add(() => this.spinner.hide());
  }

  /**
   * validation
 : void  */
  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmarPassword'),
    };
    this.form = this.fb.group(
      {
        username: [''],
        imageURL: [''],
        titulo: ['NaoInformado', Validators.required],
        primeiroNome: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
        ultimoNome: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        funcao: ['NaoInformado', Validators.required],
        descricao: [
          '',
          [
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(250),
          ],
        ],
        password: ['', [Validators.nullValidator, Validators.minLength(8)]],
        confirmarPassword: ['', [Validators.nullValidator]],
      },
      formOptions
    );
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  onSubimit(): void {
    this.atualizarUsuario();
  }

  atualizarUsuario() {
    this.userUpdate = { ...this.form.value };
    this.spinner.show();

    if (this.f.funcao.value == 'Palestrante') {
        this.palestranteService.post().subscribe(
        () => {
          this.toastr.success('Palestrante Adicionado', 'Great Sucess');
        },
        (error: Error) => {
          console.error(error);
          this.toastr.error('Erro ao atualizar usuário', 'Erro!');
        }
      )
    }

    this.accountService
      .updateUser(this.userUpdate)
      .subscribe(
        () => {
          this.toastr.success('Usuário Atualizado', 'Great Sucess');
        },
        (error: Error) => {
          console.error(error);
          this.toastr.error('Erro ao atualizar usuário', 'Erro!');
        }
      )
      .add(() => this.spinner.hide());
  }
}
