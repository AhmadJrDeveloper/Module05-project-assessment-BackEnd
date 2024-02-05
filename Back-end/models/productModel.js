import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: [
    {
      details: {
        type: String,
        required: true,
      },
      Size:{
        type:Number,
        required: true,
      },
      Ram:{
        type:Number,
        required: true,
      }
    },
  ],
  images:{
    type:String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending", "New"],
    default: "Pending",
    required: true,
  },
});

const Product = mongoose.model("products", productSchema);

export default Product;
