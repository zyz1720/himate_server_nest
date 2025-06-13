import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { RequestContext } from 'nestjs-request-context';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  readonly whiteEntitys = [];
  readonly user = RequestContext.currentContext?.req?.user;

  excludeEntity(entity: string) {
    return this.whiteEntitys.includes(entity);
  }

  beforeInsert(event: InsertEvent<any>) {
    const entityName = event.entity.constructor.name;
    if (!this.excludeEntity(entityName) && this.user) {
      event.entity.create_by = this.user.userId || 0;
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const entityName = event.entity.constructor.name;
    if (!this.excludeEntity(entityName) && this.user) {
      event.entity.update_by = this.user.userId || 0;
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    const entityName = event.entity.constructor.name;
    if (!this.excludeEntity(entityName) && this.user) {
      event.entity.delete_by = this.user.userId || 0;
    }
  }
}
