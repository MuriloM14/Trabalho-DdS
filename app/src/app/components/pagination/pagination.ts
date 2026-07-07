import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageResponse } from '../../interfaces';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class PaginationComponent {
  @Input({ required: true }) page!: PageResponse<unknown>;
  @Input() compact = false;

  @Output() pageChange = new EventEmitter<number>();
}
