import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { environment } from '../../../../environments/environment';

interface TurnstileRenderOptions {
  sitekey: string;
  action: string;
  theme: 'light';
  size: 'flexible';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
}

interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileRenderOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = 'cloudflare-turnstile-script';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | undefined;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement('script');

    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Falha ao carregar o Turnstile.')), {
      once: true,
    });

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

@Component({
  selector: 'app-turnstile',
  standalone: true,
  templateUrl: './turnstile.html',
  styleUrl: './turnstile.scss',
})
export class Turnstile implements AfterViewInit, OnDestroy {
  @Input({ required: true }) action!: 'login' | 'cadastro';
  @Output() readonly tokenChange = new EventEmitter<string>();

  @ViewChild('container', { static: true })
  private readonly container!: ElementRef<HTMLElement>;

  readonly loadError = signal(false);
  private widgetId?: string;
  private destroyed = false;

  async ngAfterViewInit(): Promise<void> {
    try {
      await loadTurnstileScript();

      if (this.destroyed || !window.turnstile) {
        return;
      }

      this.widgetId = window.turnstile.render(this.container.nativeElement, {
        sitekey: environment.turnstileSiteKey,
        action: this.action,
        theme: 'light',
        size: 'flexible',
        callback: (token) => {
          this.loadError.set(false);
          this.tokenChange.emit(token);
        },
        'expired-callback': () => this.tokenChange.emit(''),
        'error-callback': () => {
          this.loadError.set(true);
          this.tokenChange.emit('');
        },
      });
    } catch {
      this.loadError.set(true);
      this.tokenChange.emit('');
    }
  }

  reset(): void {
    this.tokenChange.emit('');

    if (this.widgetId && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    if (this.widgetId && window.turnstile) {
      window.turnstile.remove(this.widgetId);
    }
  }
}
