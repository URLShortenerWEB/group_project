import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShortURL } from '../../../shortener/models/short-url.model';
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
  @Output() urlUpdated = new EventEmitter<ShortURL>();
  @Output() urlDeleted = new EventEmitter<number>();

  displayedColumns: string[] = [
    'original_url',
    'short_url',
    'click_count',
    'created_at',
    'actions',
  ];

  constructor(private dialog: MatDialog) {}

  editUrl(url: ShortURL): void {
    const dialogRef = this.dialog.open(EditUrlDialogComponent, {
      width: '400px',
      data: { originalUrl: url.original_url },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedUrl = { ...url, original_url: result };
        this.urlUpdated.emit(updatedUrl);
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
        this.urlDeleted.emit(url.id);
      }
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Ссылка скопирована в буфер обмена');
    });
  }
}
