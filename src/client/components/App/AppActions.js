
export const LOADING = 'LOADING';
export const RESOLVED = 'RESOLVED';

export function newApiRequest() {
  return {
    type: LOADING
  }
}

export function resolveApiRequest() {
  return {
    type: RESOLVED,
  };
}
