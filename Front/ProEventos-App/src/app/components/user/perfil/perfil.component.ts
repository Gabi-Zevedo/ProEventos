import { UserUpdate } from './../../../models/identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import {
  FormGroup,
  FormBuilder,
  AbstractControlOptions,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  userUpdate = {} as UserUpdate;

  public get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
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

  atualizarUsuario(){
    this.userUpdate = { ...this.form.value}
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => {
        this.toastr.success('Usuário Atualizado', 'Great Sucess')
       },
      (error: Error) => {
        console.error(error);
        this.toastr.error('Erro ao atualizar usuário', 'Erro!');
      }
    )
    .add(() => this.spinner.hide());
  }
}
