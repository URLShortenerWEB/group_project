import { Component, OnInit } from '@angular/core';
import { ShortenerService } from '../shortener.service';
import { AuthService } from '../../auth/auth.service';
import { ShortURL, Category } from '../models/short-url.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UrlTableComponent } from '../../shared/components/url-table/url-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-urls',
  templateUrl: './my-urls.component.html',
  styleUrls: ['./my-urls.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    UrlTableComponent,
  ],
})
export class MyUrlsComponent implements OnInit {
  urls: ShortURL[] = [];
  filteredUrls: ShortURL[] = [];
  categories: Category[] = [];
  selectedCategory: number | null = null;
  isLoading = true;

  constructor(
    private shortenerService: ShortenerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Загрузка данных...');
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.shortenerService.getCategories().subscribe({
      next: (categories) => {
        console.log('Получены категории:', categories);
        this.categories = categories;
        this.loadMyURLs();
      },
      error: (err) => {
        console.error('Ошибка загрузки категорий:', err);
        this.isLoading = false;
      },
    });
  }

  loadMyURLs(): void {
    if (this.authService.userId) {
      this.shortenerService.getMyURLs(this.authService.userId).subscribe({
        next: (urls) => {
          this.urls = urls;
          this.applyFilter();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  applyFilter(): void {
    console.log('Применение фильтра для категории:', this.selectedCategory);

    if (this.selectedCategory) {
      this.filteredUrls = this.urls.filter((url) => {
        // Получаем категорию как число
        const urlCategoryId =
          typeof url.category === 'number' ? url.category : null;
        const matches = urlCategoryId === this.selectedCategory;
        console.log(
          `Ссылка ${url.id} (категория ${urlCategoryId}): ${
            matches ? 'совпадение' : 'не подходит'
          }`
        );
        return matches;
      });
    } else {
      this.filteredUrls = [...this.urls];
    }

    console.log('Результат фильтрации:', this.filteredUrls);
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.applyFilter();
  }

  handleUrlUpdated(updatedUrl: ShortURL): void {
    const updateData = {
      original_url: updatedUrl.original_url,
      category:
        typeof updatedUrl.category === 'number' ? updatedUrl.category : null,
    };

    this.shortenerService
      .updateMyURL(updatedUrl.id, updateData.original_url, updateData.category)
      .subscribe({
        next: (response) => {
          this.urls = this.urls.map((url) =>
            url.id === response.id ? response : url
          );
          this.applyFilter();
        },
        error: (err) => {
          console.error('Ошибка при обновлении:', err);
        },
      });
  }

  handleUrlDeleted(deletedId: number): void {
    this.shortenerService.deleteMyURL(deletedId).subscribe({
      next: () => {
        this.urls = this.urls.filter((url) => url.id !== deletedId);
      },
      error: () => {},
    });
  }
}
