import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogResult } from '../../../../models/dialogResult';
import { UiDialogContainerComponent } from '../../../ui';

@Component({
  selector: 'app-new-game-dialog',
  imports: [FormsModule, ReactiveFormsModule, UiDialogContainerComponent],
  templateUrl: './new-game-dialog.component.html',
  styleUrl: './new-game-dialog.component.scss'
})
export class NewGameDialogComponent {
  public dialogRef = inject<DialogRef<DialogResult>>(DialogRef);
  public form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      playersLimit: [1, [Validators.required, Validators.min(1), Validators.max(6)]]
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
