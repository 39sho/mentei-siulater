export type Mode = 'normal' | 'search' | 'simulate'

// dbModeKey : dbのモードへのアクセスのためのキー
//             他の場所でdbモードの値を変更できないようにするprivate変数
const dbModeKey = Symbol('db-mode-key')

export const setMode = (db: any, mode: Mode) => {
  db[dbModeKey] = mode;
}

export const getMode = (db: any) => {
  return db[dbModeKey] as Mode;
}
