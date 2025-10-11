import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { RequestContext } from 'nestjs-request-context';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  readonly whiteEntitys = [];

  editEntity(entity: any, field: string) {
    const req = RequestContext.currentContext?.req;
    const user = req?.user;

    if (!entity) {
      return;
    }
    const entityName = entity.constructor.name;
    if (!this.whiteEntitys.includes(entityName)) {
      entity[field] = user?.userId ?? 0;
    }
  }

  beforeInsert(event: InsertEvent<any>) {
    this.editEntity(event.entity, 'create_by');
  }

  beforeUpdate(event: UpdateEvent<any>) {
    this.editEntity(event.entity, 'update_by');
  }
}
