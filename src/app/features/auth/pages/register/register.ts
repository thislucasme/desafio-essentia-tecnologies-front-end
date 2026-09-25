import { Component, ViewChild, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { Turnstile } from '../../../../shared/components/turnstile/turnstile';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null
    : { passwordsDoNotMatch: true };
}

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    Turnstile,
  ],
  templateUrl: './register.html',
  styleUrl: '../auth-page.scss',
})
export class Register {
  @ViewChild(Turnstile) private turnstile?: Turnstile;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly turnstileToken = signal('');
  readonly hidePassword = signal(true);
  readonly hideConfirmation = signal(true);
  readonly step = signal<1 | 2>(1);

  readonly form = new FormGroup(
    {
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordsMatch },
  );

  continueToSecurity(): void {
    const { name, email } = this.form.controls;
    name.markAsTouched();
    email.markAsTouched();

    if (name.invalid || email.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.step.set(2);
  }

  backToDetails(): void {
    this.turnstileToken.set('');
    this.errorMessage.set('');
    this.step.set(1);
  }

  async submit(): Promise<void> {
    if (this.form.invalid || !this.turnstileToken()) {
      this.form.markAllAsTouched();

      if (!this.turnstileToken()) {
        this.errorMessage.set('Conclua a verificação de segurança para criar sua conta.');
      }
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    const { name, email, password } = this.form.getRawValue();
    try {
      await this.authService.register({ name, email, password }, this.turnstileToken());
      await this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage.set(this.getErrorMessage(error));
      this.turnstile?.reset();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;

      if (Array.isArray(message)) {
        return message.join(' ');
      }

      if (typeof message === 'string') {
        return message;
      }

      if (error.status === 0) {
        return 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
      }
    }

    return 'Não foi possível criar sua conta. Tente novamente.';
  }
}
