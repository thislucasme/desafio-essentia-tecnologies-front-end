import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TurnstileResponse {
  success: boolean;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
}

@Injectable()
export class TurnstileService {
  private readonly verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  constructor(private readonly config: ConfigService) {}

  async verify(token: string, expectedAction: string, remoteIp?: string): Promise<void> {
    const secret = this.config.getOrThrow<string>('TURNSTILE_SECRET_KEY');
    const body = new URLSearchParams({ secret, response: token });

    if (remoteIp) {
      body.set('remoteip', remoteIp);
    }

    let result: TurnstileResponse;

    try {
      const response = await fetch(this.verificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Cloudflare respondeu com status ${response.status}.`);
      }

      result = (await response.json()) as TurnstileResponse;
    } catch {
      throw new ServiceUnavailableException(
        'Não foi possível validar a verificação de segurança. Tente novamente em instantes.',
      );
    }

    if (!result.success || result.action !== expectedAction) {
      throw new BadRequestException(
        'A verificação de segurança falhou. Atualize o desafio e tente novamente.',
      );
    }
  }
}
