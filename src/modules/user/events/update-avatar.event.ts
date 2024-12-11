export class AvatarUpdatedEvent {
  constructor(
    public readonly userId: number,
    public readonly newAvatar: string,
  ) {}
}
