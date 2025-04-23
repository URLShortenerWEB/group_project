import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category, ShortURL } from '../../../shortener/models/short-url.model';
import { MatDialog } from '@angular/material/dialog';
import { EditUrlDialogComponent } from '../edit-url-dialog/edit-url-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-url-table',
  templateUrl: './url-table.component.html',
  styleUrls: ['./url-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    TruncatePipe,
  ],
})
export class UrlTableComponent {
  @Input() urls: ShortURL[] = [];
  @Input() categories: Category[] = [];
  @Output() urlUpdated = new EventEmitter<ShortURL>();
  @Output() urlDeleted = new EventEmitter<number>();

  displayedColumns: string[] = [
    'original_url',
    'short_url',
    'category',
    'click_count',
    'created_at',
    'actions',
  ];

  constructor(private dialog: MatDialog) {}

  editUrl(url: ShortURL): void {
    const dialogRef = this.dialog.open(EditUrlDialogComponent, {
      width: '500px',
      data: {
        originalUrl: url.original_url,
        categoryId: typeof url.category === 'number' ? url.category : null,
        categories: this.categories,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.urlUpdated.emit({
          ...url,
          original_url: result.original_url,
          category: result.category_id,
        });
      }
    });
  }

  deleteUrl(url: ShortURL): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Удаление ссылки',
        message: 'Вы уверены, что хотите удалить эту ссылку?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.urls = this.urls.filter((u) => u.id !== url.id);

        this.urlDeleted.emit(url.id);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Ссылка скопирована в буфер обмена');
    });
  }
}
