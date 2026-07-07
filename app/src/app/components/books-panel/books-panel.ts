import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BookFormModel, BookItem, BookStatus, PageResponse } from '../../interfaces';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-books-panel',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './books-panel.html',
  styleUrl: './books-panel.css'
})
export class BooksPanelComponent {
  @Input() mode: 'shortcut' | 'library' = 'shortcut';
  @Input({ required: true }) bookStatusFilters!: ReadonlyArray<{ value: BookStatus | ''; label: string }>;
  @Input({ required: true }) bookStatusOptions!: ReadonlyArray<{ value: BookStatus; label: string }>;
  @Input({ required: true }) statusLabels!: Record<BookStatus, string>;
  @Input({ required: true }) selectedBookStatus!: BookStatus | '';
  @Input({ required: true }) bookForm!: BookFormModel;
  @Input({ required: true }) booksPage!: PageResponse<BookItem>;
  @Input() booksError = '';
  @Input() booksLoading = false;
  @Input() bookSaving = false;
  @Input() editingBookId: number | null = null;

  @Output() selectedBookStatusChange = new EventEmitter<BookStatus | ''>();
  @Output() filterChange = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<NgForm>();
  @Output() cancelEdit = new EventEmitter<NgForm>();
  @Output() editBook = new EventEmitter<BookItem>();
  @Output() removeBook = new EventEmitter<BookItem>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() libraryOpen = new EventEmitter<void>();

  onBookStatusChange(value: BookStatus | ''): void {
    this.selectedBookStatusChange.emit(value);
    this.filterChange.emit();
  }

  onSubmit(form: NgForm): void {
    this.submitForm.emit(form);
  }

  onCancelEdit(form: NgForm): void {
    this.cancelEdit.emit(form);
  }

  statusClass(status: BookStatus): string {
    switch (status) {
      case 'LENDO':
        return 'status-lendo';
      case 'QUERO_LER':
        return 'status-quero-ler';
      case 'ABANDONEI':
        return 'status-abandonei';
      case 'JA_LI':
        return 'status-ja-li';
      case 'FAVORITO':
        return 'status-favorito';
      default:
        return '';
    }
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
