import { ICartProduct, ShippingAddress } from '@/interfaces';
import { CartState } from '.';

type CartActionType =
  | {
      type: '[Cart] - Load cart from cookies | storage';
      payload: ICartProduct[];
    }
  | { type: '[Cart] - Update cart products'; payload: ICartProduct[] }
  | { type: '[Cart] - Change cart product quantity'; payload: ICartProduct }
  | { type: '[Cart] - Remove cart product'; payload: ICartProduct }
  | {
      type: '[Cart] - Load address from cookies';
      payload: ShippingAddress;
    }
  | {
      type: '[Cart] - Update address';
      payload: ShippingAddress;
    }
  | {
      type: '[Cart] - Update cart order summary';
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | { type: '[Cart] - Order complete' };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case '[Cart] - Load cart from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case '[Cart] - Update cart products':
      return {
        ...state,
        cart: [...action.payload],
      };
    case '[Cart] - Change cart product quantity':
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };
    case '[Cart] - Remove cart product':
      return {
        ...state,
        cart: state.cart.filter(
          ({ _id, size }) =>
            !(_id === action.payload._id && size === action.payload.size)
        ),
      };
    case '[Cart] - Load address from cookies':
    case '[Cart] - Update address':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case '[Cart] - Update cart order summary':
      return {
        ...state,
        ...action.payload,
      };
    case '[Cart] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    default:
      return state;
  }
};
