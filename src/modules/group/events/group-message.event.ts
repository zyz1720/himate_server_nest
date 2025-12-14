export class GroupMessageEvent {
  constructor(
    public readonly uid: number,
    public readonly group_id: string,
    public readonly message: string,
  ) {}
}
