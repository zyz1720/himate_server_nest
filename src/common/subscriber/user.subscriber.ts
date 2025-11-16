import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AsyncContext } from 'src/core/context/async-context.model';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  readonly whiteEntities = [];

  editEntity(entity: any, field: string) {
    const AuthInfo = AsyncContext.getContext();
    if (!entity) {
      return;
    }
    const entityName = entity.constructor.name;
    if (!this.whiteEntities.includes(entityName)) {
      if (entity[field]) {
        return;
      }
      entity[field] = AuthInfo?.userId ?? 0;
    }
  }

  beforeInsert(event: InsertEvent<any>) {
    this.editEntity(event.entity, 'create_by');
    this.editEntity(event.entity, 'update_by');
  }

  beforeUpdate(event: UpdateEvent<any>) {
    this.editEntity(event.entity, 'update_by');
  }
}
