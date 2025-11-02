import { Component } from '@angular/core';
import { TermLine } from '../../../models/termLine';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { getAuth, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseService } from '../../services/firebase.service';
import { APP_TITLE_LINES } from '../../../environment/titleLines';

@Component({
  selector: 'app-auth-page',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  public authSubtitleLines: TermLine[] = []
  public mode: 'login' | 'register' = 'login';
  public form: FormGroup = new FormGroup({});
  public authLoading: boolean = false;
  public titleLines = APP_TITLE_LINES;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.mode = params['mode'] === 'register' ? 'register' : 'login';
    });
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authSubtitleLines = [
      { text: '[LOADING] ALT OS Authentication...', delay: 200, class: 'subtitle-line' },
      { text: `${this.mode === 'login' ? 'Login' : 'Register'} View Initialized ..................... [  OK  ]`, delay: 400, class: 'subtitle-line' },
      { text: this.mode === 'login' ? 'Enter your credentials' : 'Fill in your details', delay: 600, class: 'subtitle-line' },
    ];

    this.form.get('username')?.setValidators(this.mode === 'register' ? [Validators.required] : []);
    this.form.get('username')?.updateValueAndValidity();
  }

  onSubmit() {
    this.authLoading = true;
    switch (this.mode) {
      case 'login':
        this.loginUserWithEmailAndPassword(this.form.value.email, this.form.value.password);
        break;
      case 'register':
        this.registerUserWithEmailAndPassword(this.form.value.username, this.form.value.email, this.form.value.password);
        break;
    }
  }

  // Methods

  private registerUserWithEmailAndPassword(username: string, email: string, password: string) {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            this.firebaseService.registerNewUser(user.uid, username, email).then(() => {
              this.authSubtitleLines.push({ text: `[SUCCESS] User data saved successfully.`, delay: 500, class: 'subtitle-line' });
              this.authSubtitleLines.push({ text: `[DONE] Registration completed! Redirecting....`, delay: 1000, class: 'subtitle-line' });
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 2500);
            });
          }
          ).catch((error) => {
            const errorMessage = error.message;
            this.authLoading = false;
            this.authSubtitleLines.push({ text: `[ERROR] ${errorMessage}`, delay: 0, class: 'subtitle-line error-line' });
          });
      })
  }

  private loginUserWithEmailAndPassword(email: string, password: string) {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            this.authSubtitleLines.push({ text: `[SUCCESS] Login successful. Redirecting...`, delay: 500, class: 'subtitle-line' });
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2500);
          })
          .catch((error) => {
            const errorMessage = error.message;
            this.authLoading = false;
            this.authSubtitleLines.push({ text: `[ERROR] ${errorMessage}`, delay: 0, class: 'subtitle-line error-line' });
          });
      });
  }
}
