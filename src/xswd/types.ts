export enum Permission {
  Ask = 0,
  AcceptAlways = 1,
  DenyAlways = 2
}

export interface ApplicationData {
  id: string
  name: string
  description: string
  url?: string
  permissions: Map<string, Permission>
  signature?: string
}