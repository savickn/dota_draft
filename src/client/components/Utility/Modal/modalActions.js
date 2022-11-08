
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const closeModal = (id) => {
  return {
    type: CLOSE_MODAL,
    id, 
  }
}

export const openModal = (id) => {
  return {
    type: OPEN_MODAL,
    id, 
  }
}

