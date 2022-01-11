import { AccountService } from './../../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserUpdate } from './../../../models/identity/UserUpdate';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  usuario = {} as UserUpdate;
  public file: File;
  public imageURL = '';


  public get isPalestrante(): boolean{
    return this.usuario.funcao == 'Palestrante';
  }

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
  }

public getFormValue(usuario: UserUpdate):void{
  this.usuario = usuario;

  if (this.usuario.imageURL) {
    this.imageURL = environment.apiURL + `resources/perfil/${this.usuario.imageURL}`;
  } else {
    this.imageURL = '../../../../assets/semImagemUser.png'
  }
}

onFileChange(event: any): void{
  const reader = new FileReader();

  reader.onload = (event: any) => this.imageURL = event.target.result;

  this.file = event.target.files;
  reader.readAsDataURL(this.file[0]);

  this.uploadImagem();
}

uploadImagem(): void{
  this.spinner.show();
  this.accountService.postUpload(this.file).subscribe(

    () => {
      this.toastr.success( 'Imagem Atualizada com Sucesso', 'Great Sucess');
    },

    (error: any) => {
      this.toastr.error(`Erro ao Atualizar Imagem`, 'Erro!');
      console.error(error);
    }


    ).add(() => this.spinner.hide())



}

}
