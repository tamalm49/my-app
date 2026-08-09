import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  requestId: string;
  userId: string | null;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const RequestContextStore = {
  run(context: RequestContext, callback: () => void) {
    asyncLocalStorage.run(context, callback);
  },
getRequestId(): string | null {
    return asyncLocalStorage.getStore()?.requestId ?? null;
  },
  getUserId(): string | null {
    return asyncLocalStorage.getStore()?.userId ?? null;
  },
setRequestId(requestId: string) {
    const store = asyncLocalStorage.getStore(); 
    if (store) {
      store.requestId = requestId;
    }
  },
  setUserId(userId: string | null) {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.userId = userId;
    }
  }
};