import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-terminal-input',
  imports: [ReactiveFormsModule],
  templateUrl: './terminal-input.component.html',
  styleUrl: './terminal-input.component.scss',
})
export class TerminalInputComponent {
  public form: FormGroup;

  @Output() command = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      command: ['']
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.command.emit(this.form.get('command')?.value);
    this.form.reset();
  }
}
