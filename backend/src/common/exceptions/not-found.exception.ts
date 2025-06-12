import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, id: number | string) {
    super({
      message: `${resource} with ID ${id} not found`,
      error: 'Not Found',
      resource,
      resourceId: id,
    });
  }
}
