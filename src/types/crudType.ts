export interface CrudOptions<T> {
  apiPath: string;
  idKey?: keyof T;
}