import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogResult } from '../../../../models/dialogResult';
import { UiDialogContainerComponent } from '../../../ui';

@Component({
  selector: 'app-join-game-dialog',
  imports: [FormsModule, ReactiveFormsModule, UiDialogContainerComponent],
  templateUrl: './join-game-dialog.component.html',
  styleUrl: './join-game-dialog.component.scss'
})
export class JoinGameDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult>>(DialogRef);
  public form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public confirm(): void {
    this.dialogRef.close({
      status: 'confirmed',
      data: this.form.value
    });
  }

  public cancel(): void {
    this.dialogRef.close({
      status: 'cancelled',
      data: null
    });
  }
}
