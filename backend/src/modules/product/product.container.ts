import { CategoryRepository } from "../category/category.repository.js";
import { ProductRepository } from "./product.repository.js";
import { ProductService } from "./product.service.js";

const productRepository=new ProductRepository();
const categoryRepository=new CategoryRepository();

const productService=new ProductService(productRepository,categoryRepository);

export {productService}