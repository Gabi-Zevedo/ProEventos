import { PalestranteDetalheComponent } from './components/palestrantes/palestrante-detalhe/palestrante-detalhe.component';
import { PalestranteListaComponent } from './components/palestrantes/palestrante-lista/palestrante-lista.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoteService } from './services/lote.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { NavComponent } from './shared/nav/nav.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { PerfilDetalheComponent } from './components/user/perfil/perfil-detalhe/perfil-detalhe.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxCurrencyModule } from 'ngx-currency';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';

import { EventoService } from './services/evento.service';
import { TituloComponent } from './shared/titulo/titulo.component';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { AccountService } from './services/account.service';
import { HomeComponent } from './components/home/home.component';
import { PalestranteService } from './services/palestrante.service';
import { RedesSociaisComponent } from './components/redes-sociais/redes-sociais.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventosComponent,
    PalestrantesComponent,
    PalestranteDetalheComponent,
    NavComponent,
    DateTimeFormatPipe,
    ContatosComponent,
    DashboardComponent,
    PerfilComponent,
    PerfilDetalheComponent,
    TituloComponent,
    EventoDetalheComponent,
    EventoListaComponent,
    PalestranteListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    RedesSociaisComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    NgxSpinnerModule,
    NgxCurrencyModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
  ],
  providers: [
    EventoService,
    PalestranteService,
    LoteService,
    AccountService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
