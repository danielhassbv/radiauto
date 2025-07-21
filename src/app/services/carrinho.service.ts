import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    itens: Produto[] = [];

    adicionar(produto: Produto) {
        this.itens.push(produto);
        localStorage.setItem('carrinho', JSON.stringify(this.itens));
    }

    listar(): Produto[] {
        return JSON.parse(localStorage.getItem('carrinho') || '[]');
    }

    limpar() {
        this.itens = [];
        localStorage.removeItem('carrinho');
    }
}
