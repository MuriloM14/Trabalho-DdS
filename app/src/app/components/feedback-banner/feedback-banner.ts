import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FeedbackKind } from '../../interfaces';

@Component({
  selector: 'app-feedback-banner',
  imports: [CommonModule],
  templateUrl: './feedback-banner.html',
  styleUrl: './feedback-banner.css'
})
export class FeedbackBannerComponent {
  @Input({ required: true }) message!: string;
  @Input() kind: FeedbackKind = 'success';
}
