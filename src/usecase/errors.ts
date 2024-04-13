export type Kind = 'NotFound' | 'InternalServerError'

const isKind = (a: any): a is Kind => {
  return a === 'NotFound' || a === 'InternalServerError'
}

export type UsecaseError = {
  kind: Kind;
  message: string;
}

export const isUsecaseError = (a: any): a is UsecaseError => {
  return typeof a === 'object' && isKind(a.kind) && typeof a.message === 'string'
}
