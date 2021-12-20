import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../../services/account.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/identity/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  user = {} as User;

  public get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.validation();
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
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword: ['', [Validators.required]],
      },
      formOptions
    );
  }

  register(): void {
    this.user = { ...this.form.value };
    this.accountService.register(this.user).subscribe(
      () => this.router.navigateByUrl('/dashboard'),

      (error: any) => {
        this.toastr.error('Erro ao cadastrar usuário');
        console.error(error);
      }
    )
  }
}
