import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../models/product.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatCardModule, MatIconModule, NgFor],
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.scss'],
})
export class ProductListComponent implements OnInit {
  products: any;

  displayedColumns = ['image', 'title', 'price', 'actions'];

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.products = this.productsService.getProductsSignal();

    this.productsService.loadProducts().catch((err) => {
      console.error('Error cargando productos', err);
      this.snackBar.open('Error cargando productos', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(ProductDialogComponent, {
      width: '480px',
      data: null,
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.productsService.addProduct(result);
        this.snackBar.open('Producto creado', 'OK', { duration: 2000 });
      }
    });
  }

  openEditDialog(product: Product): void {
    const ref = this.dialog.open(ProductDialogComponent, {
      width: '480px',
      data: { ...product },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.productsService.updateProduct(result);
        this.snackBar.open('Producto actualizado', 'OK', { duration: 2000 });
      }
    });
  }

  deleteProduct(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar este producto?')) return;

    this.productsService.deleteProduct(id);
    this.snackBar.open('Producto eliminado', 'OK', { duration: 2000 });
  }
}
