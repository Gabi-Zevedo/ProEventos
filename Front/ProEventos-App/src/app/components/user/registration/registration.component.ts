import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form!: FormGroup;


  public get f() : any {
    return this.form.controls;
  }


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }

  /**
   * validation
 : void  */
  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmarSenha')
    };
    this.form = this.fb.group({
      primeiroNome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]],
      ultimoNome: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]],
      senha: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      confirmarSenha: ['', [
        Validators.required,
      ]],
    }, formOptions);
  }

}
