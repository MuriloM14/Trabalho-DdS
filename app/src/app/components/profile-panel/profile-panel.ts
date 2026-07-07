import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageResponse, PostItem, UserProfile } from '../../interfaces';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'app-profile-panel',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './profile-panel.html',
  styleUrl: './profile-panel.css'
})
export class ProfilePanelComponent {
  @Input() currentUserId: number | null = null;
  @Input() profileError = '';
  @Input() profileLoading = false;
  @Input() selectedProfile: UserProfile | null = null;
  @Input({ required: true }) profilePostsPage!: PageResponse<PostItem>;

  @Output() postsPageChange = new EventEmitter<number>();

  get isOwnProfile(): boolean {
    return !!this.selectedProfile && this.selectedProfile.id === this.currentUserId;
  }

  get profileTitle(): string {
    if (!this.selectedProfile) {
      return 'Perfil';
    }

    return this.isOwnProfile ? 'Meu perfil' : `Perfil de ${this.selectedProfile.nome}`;
  }

  get profileContext(): string {
    return this.isOwnProfile ? 'Sua area' : 'Perfil visitado';
  }

  get postsTitle(): string {
    return this.isOwnProfile ? 'Minhas publicacoes' : `Publicacoes de ${this.selectedProfile?.nome ?? 'leitor'}`;
  }

  getProfileInitial(): string {
    return this.selectedProfile?.nome.charAt(0).toUpperCase() ?? '?';
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
