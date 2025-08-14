import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PainelProdutosComponent } from './pages/painel-produtos/painel-produtos.component';
import { CadastroProdutoComponent } from './pages/cadastro-produto/cadastro-produto.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { PainelUsuariosComponent } from './pages/painel-usuarios/painel-usuarios.component';
import { ListagemProdutosComponent } from './pages/listagem-produtos/listagem-produtos.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    {
        path: 'painel-produtos',
        component: PainelProdutosComponent,
    },
    {
        path: 'painel-cliente',
        loadComponent: () => import('./pages/painel-cliente/painel-cliente.component').then(m => m.PainelClienteComponent),
        data: { role: 'cliente' }
    },
    {
        path: 'cadastro-produto',
        component: CadastroProdutoComponent,
        outlet: 'modal'

    },
    {
        path: 'registrar-admin',
        loadComponent: () => import('./pages/register-admin/register-admin.component').then(m => m.RegisterAdminComponent)
    },
    {
        path: 'listagem-produtos',
        component: ListagemProdutosComponent
    },

    { path: 'usuarios', component: PainelUsuariosComponent, canActivate: [authGuard] }
];