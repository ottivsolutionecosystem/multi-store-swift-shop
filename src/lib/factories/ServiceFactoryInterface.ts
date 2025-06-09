
export interface ServiceFactory {
  create(storeId: string): any;
}
