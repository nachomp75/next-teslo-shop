import { UIState } from '.';

type UIActionType = { type: '[UI] - Toggle menu' };

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case '[UI] - Toggle menu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    default:
      return state;
  }
};
