import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss'],
})
export class TituloComponent implements OnInit {
  @Input() titulo: string | undefined;
  @Input() icone = 'fa fa-user';
  @Input() subtitulo = 'Since 2021';
  @Input() botaoListar = false;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  listar(): void{
    this.router.navigate([`/${this.titulo?.toLocaleLowerCase()}/lista`])
  }
}
