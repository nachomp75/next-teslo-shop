import { FC, useReducer, PropsWithChildren, useEffect } from 'react';

import Cookies from 'js-cookie';
import axios from 'axios';

import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { tesloApi } from '@/api';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,

  shippingAddress: undefined,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookies.get('cart')
        ? JSON.parse(Cookies.get('cart')!)
        : [];
      dispatch({
        type: '[Cart] - Load cart from cookies | storage',
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - Load cart from cookies | storage',
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get('firstName')) {
      const shippingAddress = {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
      };

      dispatch({
        type: '[Cart] - Load address from cookies',
        payload: shippingAddress,
      });
    }
  }, []);

  useEffect(() => {
    if (state.cart.length > 0) Cookies.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (acc, { quantity }) => acc + quantity,
      0
    );
    const subTotal = state.cart.reduce(
      (acc, { quantity, price }) => acc + quantity * price,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };

    dispatch({
      type: '[Cart] - Update cart order summary',
      payload: orderSummary,
    });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCartButDifferentSize = state.cart.some(
      ({ _id, size }) => _id === product._id && size === product.size
    );
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: '[Cart] - Update cart products',
        payload: [...state.cart, product],
      });
    }

    const updatedProducts = state.cart.map((cartProduct) => {
      if (cartProduct._id !== product._id) return cartProduct;
      if (cartProduct.size !== product.size) return cartProduct;

      cartProduct.quantity += product.quantity;
      return cartProduct;
    });

    dispatch({
      type: '[Cart] - Update cart products',
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Change cart product quantity',
      payload: product,
    });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Remove cart product',
      payload: product,
    });
  };

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set('firstName', address.firstName);
    Cookies.set('lastName', address.lastName);
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 || '');
    Cookies.set('zip', address.zip);
    Cookies.set('city', address.city);
    Cookies.set('country', address.country);
    Cookies.set('phone', address.phone);

    dispatch({ type: '[Cart] - Update address', payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error('There is no shipping address');
    }

    const body: IOrder = {
      orderItems: state.cart.map((product) => ({
        ...product,
        size: product.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      dispatch({ type: '[Cart] - Order complete' });

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true,
        message: 'Unhandled error',
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        // Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        // Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
