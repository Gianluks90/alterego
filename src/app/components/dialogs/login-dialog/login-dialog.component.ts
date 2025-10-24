import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public register() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.warn('Invalid form');
    }
  }

  public login() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.warn('Invalid form');
    }
  }
}
