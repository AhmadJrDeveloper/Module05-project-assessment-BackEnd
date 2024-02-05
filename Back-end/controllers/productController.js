import mongoose from "mongoose";
import Product from "../models/productModel.js";

export default class ProductController {
  static createProduct = async (req, res) => {
    upload.array('images')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Multer error' });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { productName, description, Size, Ram, image } = req.body;

      try {
        // Check if the product already exists
        const existingProduct = await Product.findOne({
          $or: [{ productName }],
        });

        if (existingProduct) {
          return res
            .status(400)
            .json({ error: "product already exists" });
        }

        const product = await Product.create({
          productName,
          description,
          Size,
          Ram,
          image
        });

        res.status(200).json(product);
      } catch (error) {
        // Handle other errors
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  };

  static readProduct = async (req, res) => {
    try {
      const product = await Product.find();
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: { ...error } });
    }
  };

  static readOneProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ data: null, message: "not found", status: 404 });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ data: null, message: "not found", status: 404 });
    }

    res.status(200).json({ data: product, message: "succes", status: 200 });
  };

  static updateProduct = async (req, res) => {
    const { id } = req.params;
    const {productName, description, Size, Ram } = req.body;


    try {
      const updateFields = {
        productName,
        description,
        Size,
        Ram
      };

      const product = await Product.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      await Product.findByIdAndDelete(id);
      res.status(200).json({ message: "product deleted succefully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

}
