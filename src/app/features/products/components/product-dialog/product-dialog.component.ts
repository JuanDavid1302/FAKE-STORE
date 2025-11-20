import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Product } from '../../../products/models/product.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Necesario para trabajar con FormGroup/FormBuilder
    MatDialogModule, // Necesario para <mat-dialog-content> <mat-dialog-actions>
    MatFormFieldModule, // Necesario para <mat-form-field>
    MatInputModule, // Necesario para matInput
    MatButtonModule, // Necesario para botones
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      title: [this.data?.title ?? '', [Validators.required, Validators.minLength(3)]],
      price: [this.data?.price ?? 0, [Validators.required, Validators.min(0)]],
      description: [this.data?.description ?? ''],
      category: [this.data?.category ?? ''],
      image: [this.data?.image ?? ''],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as Product;
    this.dialogRef.close(value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
