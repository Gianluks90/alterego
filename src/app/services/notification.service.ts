import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, icon = 'info', duration = 3000) {

    const isMobile = window.innerWidth <= 768;

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, icon },
      duration,
      panelClass: 'generic-snackbar',
      verticalPosition: isMobile ? 'bottom' : 'top',
    });
  }
}