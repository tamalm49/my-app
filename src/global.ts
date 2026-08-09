import { RequestContextStore } from './cores/request-context.js';

declare global {
  var getUserId: () => string | null;
  var getRequestId: () => string | null;
}

globalThis.getUserId = () => RequestContextStore.getUserId();
globalThis.getRequestId = () => RequestContextStore.getRequestId();

export {};
