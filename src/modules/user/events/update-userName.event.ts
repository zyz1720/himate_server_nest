export class UserNameUpdatedEvent {
  constructor(
    public readonly userId: number,
    public readonly newUserName: string,
  ) {}
}
