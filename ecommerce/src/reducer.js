export const initialState = {
    basket: [],
    latestOrder: [],
    user: null,
    notification: null,
};

export const getBasketTotal = (basket) => {
    return basket?.reduce((amount, item) => item.price + amount, 0);
};

const reducer = (state, action) => {
    console.log(action);
    switch(action.type) {
        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item]
            };

        case 'REMOVE_FROM_BASKET':
            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.id
            );

            let newBasket = [...state.basket];

            if (index >= 0) {
                newBasket.splice(index, 1);
            } else {
                console.warn(`Can't remove product with id: ${action.id}, not in basket!`)
            }

            return {
                ...state,
                basket: newBasket
            };

        case 'SET_USER':
            return {
                ...state,
                user: action.user
            }

        case 'SET_PREV_ORDER':
            return {
                ...state,
                latestOrder: action.order
            }

        case 'EMPTY_BASKET':
            return {
                ...state,
                basket: []
            }

        case 'SET_NOTIFICATION':
            return {
                ...state,
                notification: {
                    text: action.message,
                    image: action.image
                }
            }

        case 'CLEAR_NOTIFICATION':
            return {
                ...state,
                notification: null
            }

        default:
            return state;
    }
};

export default reducer;