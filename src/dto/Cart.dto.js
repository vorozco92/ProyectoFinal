export default class CartDTO {
    static getCartInputFrom = (cart) =>{
        return {
            user: cart.user,
            products : cart.products || []
        }
    }
}