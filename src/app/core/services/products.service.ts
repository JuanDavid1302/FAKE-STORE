import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../features/products/models/product.model';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly API = 'https://fakestoreapi.com/products';

  // Estado local con Signals
  productsSignal = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  // GET a la API
  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API);
  }

  // Inicializar la señal con datos de la API
  async loadProducts() {
    const products = await firstValueFrom(this.fetchProducts());
    this.productsSignal.set(products);
  }

  // ----- CRUD LOCAL -----

  addProduct(product: Product) {
    const current = this.productsSignal();

    const newId = (current.length ? Math.max(...current.map((p) => p.id ?? 0)) : 0) + 1;

    const newProduct = { ...product, id: newId };

    this.productsSignal.update((arr) => [newProduct, ...arr]);
    return newProduct;
  }

  updateProduct(updated: Product) {
    this.productsSignal.update((arr) =>
      arr.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  }

  deleteProduct(id: number) {
    this.productsSignal.update((arr) => arr.filter((p) => p.id !== id));
  }

  // Exponer la señal
  getProductsSignal() {
    return this.productsSignal;
  }
}
