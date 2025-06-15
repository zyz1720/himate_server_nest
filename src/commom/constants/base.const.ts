import { join } from 'path';
const uploadDir = join(__dirname, '../../../', '../public/uploads');
const ThumbnailDir = join(__dirname, '../../../', '../public/Thumbnail');
const recycleDir = join(__dirname, '../../../', '../public/recycle_bin');

export const BaseConst = {
  RoomName: 'himateRoom',
  DefaultFavoritesName: '我的收藏',
  DefaultUserPassword: '123456',
  uploadDir,
  ThumbnailDir,
  recycleDir,
};
