import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSession } from '../../interfaces';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSectionComponent {
  @Input() currentUser: UserSession | null = null;
  @Input() booksTotal = 0;
  @Input() feedTotal = 0;

  @Output() profileOpen = new EventEmitter<number>();
  @Output() logoutUser = new EventEmitter<void>();
}
