import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const repository = {
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const service = new TasksService(repository as unknown as Repository<Task>);

  beforeEach(() => jest.clearAllMocks());

  it('deve paginar somente as tarefas do usuário autenticado', async () => {
    repository.findAndCount.mockResolvedValue([[], 5]);

    const result = await service.findAll('usuario-1', { page: 2, limit: 2 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { userId: 'usuario-1' },
      order: { createdAt: 'DESC' },
      skip: 2,
      take: 2,
    });
    expect(result.meta).toEqual({ page: 2, limit: 2, totalItems: 5, totalPages: 3 });
  });

  it('deve impedir o acesso a uma tarefa inexistente ou de outro usuário', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('tarefa-1', 'usuario-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'tarefa-1', userId: 'usuario-1' });
  });

  it('deve atualizar o status de uma tarefa pertencente ao usuário', async () => {
    const task = {
      id: 'tarefa-1',
      userId: 'usuario-1',
      title: 'Estudar NestJS',
      description: null,
      status: TaskStatus.PENDING,
    } as Task;
    repository.findOneBy.mockResolvedValue(task);
    repository.save.mockImplementation((value) => Promise.resolve(value));

    const result = await service.update('tarefa-1', 'usuario-1', { status: TaskStatus.DONE });

    expect(result.status).toBe(TaskStatus.DONE);
    expect(repository.save).toHaveBeenCalledWith(task);
  });
});
