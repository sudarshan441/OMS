const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Customer = require("./models/Customer");
const Product = require("./models/Product");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  logger.info("MongoDB connected");

  await Customer.deleteMany();
  await Product.deleteMany();

  const customer = await Customer.create({
    name: "John Doe",
    email: "john@example.com",
  });
  const products = await Product.insertMany([
    { name: "Widget A", price: 100, stock: 20 },
    { name: "Widget B", price: 200, stock: 10 },
  ]);

  logger.info("Seeding complete");
  mongoose.disconnect();
});
