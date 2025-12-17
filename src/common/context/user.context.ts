import { AsyncLocalStorage } from 'async_hooks';
import { IJwtSign } from 'src/core/auth/auth.service';

export class UserContext {
  static readonly asyncLocalStorage = new AsyncLocalStorage<IJwtSign>();

  static run(context: IJwtSign, callback?: () => void) {
    this.asyncLocalStorage.run(context, callback || (() => {}));
  }

  static getContext(): IJwtSign | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
