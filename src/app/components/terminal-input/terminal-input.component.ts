import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-terminal-input',
  imports: [ReactiveFormsModule],
  templateUrl: './terminal-input.component.html',
  styleUrl: './terminal-input.component.scss',
})
export class TerminalInputComponent {
  public form: FormGroup;

  @ViewChild('cmdInput') cmdInput: HTMLInputElement | undefined;
  @Output() command = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      command: ['']
    });
  }

  private history: string[] = [];
  private historyIndex: number = -1;

  ngOnInit() {
    this.history = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.history.length && event.key !== 'Enter') return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.form.get('command')?.setValue(this.history[this.history.length - 1 - this.historyIndex]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.form.get('command')?.setValue(this.history[this.history.length - 1 - this.historyIndex]);
      } else {
        this.historyIndex = -1;
        this.form.get('command')?.setValue('');
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const cmd = this.form.get('command')?.value;

    this.command.emit(cmd);

    // Salva nel localStorage
    if (cmd !== '/clear-history' && cmd !== '/purge') {
      const history = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
      history.push(cmd);
      localStorage.setItem('terminalHistory', JSON.stringify(history));
      this.history = history;
      this.historyIndex = -1; // resetto la posizione nel buffer
    }

    // Aggiorna anche la history locale

    this.form.reset();
    this.cmdInput?.blur();
  }
}
