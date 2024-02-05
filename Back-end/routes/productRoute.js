// product Route (product.route.js)
import express from "express";
import ProductController from "../controllers/productController.js";
// import { authenticate } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.post("/", ProductController.createProduct);
productRouter.get("/", ProductController.readProduct);
productRouter.get("/:id", ProductController.readOneProduct);
productRouter.patch("/:id", ProductController.updateProduct);
productRouter.delete("/:id", ProductController.deleteProduct);

export default productRouter;
