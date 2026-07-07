import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthFormModel, AuthMode } from '../../interfaces';

@Component({
  selector: 'app-auth-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-panel.html',
  styleUrl: './auth-panel.css'
})
export class AuthPanelComponent {
  @Input({ required: true }) authMode!: AuthMode;
  @Input({ required: true }) authForm!: AuthFormModel;
  @Input() authLoading = false;

  @Output() authModeChange = new EventEmitter<AuthMode>();
  @Output() submitForm = new EventEmitter<NgForm>();

  setMode(mode: AuthMode): void {
    this.authModeChange.emit(mode);
  }

  onSubmit(form: NgForm): void {
    this.submitForm.emit(form);
  }
}
