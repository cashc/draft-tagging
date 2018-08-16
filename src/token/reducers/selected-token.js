import { OPEN_MODAL, CLOSE_MODAL } from '../action-types';

export function selectedToken(state = false, action = {}) {
  switch (action.type) {
    case OPEN_MODAL: return action.payload.selectedToken;
    case CLOSE_MODAL: return false;
    default: return state;
  }
}
