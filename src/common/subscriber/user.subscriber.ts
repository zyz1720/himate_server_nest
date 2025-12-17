import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserContext } from 'src/common/context/user.context';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  readonly whiteEntities = [];

  editEntity(entity: any, field: string) {
    const userContext = UserContext.getContext();
    if (!entity) {
      return;
    }
    const entityName = entity.constructor.name;
    if (!this.whiteEntities.includes(entityName)) {
      if (entity[field]) {
        return;
      }
      entity[field] = userContext?.userId || 0;
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
