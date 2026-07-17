import { CartDetails } from "./cart.interface.js";
import { CartResponseDTO } from "./cart.response.js";

export const toCartResponse=(cart:CartDetails):CartResponseDTO=>{
    const totalItems=cart.items.reduce((sum,item)=>sum+item.quantity,0)

  const totalPrice = cart.items.reduce(
    (sum, item) =>
      sum + item.quantity * item.product.price.toNumber(),
    0
  );
 return {
    id: cart.id,
    totalItems,
    totalPrice,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        productName: item.product.productName,
        price: item.product.price.toNumber(),
        productImageUrls: item.product.productImageUrls,
      },
    })),
  };
};
