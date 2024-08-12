export type User = {
  // userId: string,
  point: number,
}

// dbUserKey : dbのモードへのアクセスのためのキー
//             他の場所でdbモードの値を変更できないようにするprivate変数
const dbUserKey = Symbol('db-user-key')

export const setUser = (db: any, user: User) => {
  db[dbUserKey] = user;
}

export const getUser = (db: any) => {
  return db[dbUserKey] as User;
}
