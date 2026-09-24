import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TurnstileService } from './turnstile.service';

describe('TurnstileService', () => {
  const config = {
    getOrThrow: jest.fn().mockReturnValue('test-secret'),
  };
  const service = new TurnstileService(config as unknown as ConfigService);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve aceitar um token válido para a ação esperada', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true, action: 'login' }), { status: 200 }),
      );

    await expect(service.verify('token-valido', 'login', '127.0.0.1')).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('deve rejeitar um token inválido ou usado em outra ação', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true, action: 'cadastro' }), { status: 200 }),
      );

    await expect(service.verify('token-valido', 'login')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('deve informar indisponibilidade quando a Cloudflare não responder', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Falha de rede'));

    await expect(service.verify('token-valido', 'login')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
