import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { PaginatedTasksResponseDto, TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tarefas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tarefas')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado.',
  type: ErrorResponseDto,
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar as tarefas do usuário autenticado' })
  @ApiOkResponse({ description: 'Página de tarefas do usuário.', type: PaginatedTasksResponseDto })
  @ApiBadRequestResponse({
    description: 'Parâmetros de paginação inválidos.',
    type: ErrorResponseDto,
  })
  findAll(@CurrentUser() user: User, @Query() query: ListTasksQueryDto) {
    return this.tasksService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar uma tarefa' })
  @ApiOkResponse({ description: 'Tarefa encontrada.', type: TaskResponseDto })
  @ApiBadRequestResponse({ description: 'ID inválido.', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada.', type: ErrorResponseDto })
  findOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma tarefa' })
  @ApiCreatedResponse({ description: 'Tarefa criada.', type: TaskResponseDto })
  @ApiBadRequestResponse({ description: 'Dados da tarefa inválidos.', type: ErrorResponseDto })
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar uma tarefa ou alterar seu status' })
  @ApiOkResponse({ description: 'Tarefa atualizada.', type: TaskResponseDto })
  @ApiBadRequestResponse({ description: 'ID ou dados inválidos.', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada.', type: ErrorResponseDto })
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma tarefa' })
  @ApiNoContentResponse({ description: 'Tarefa excluída com sucesso.' })
  @ApiBadRequestResponse({ description: 'ID inválido.', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada.', type: ErrorResponseDto })
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id, user.id);
  }
}
