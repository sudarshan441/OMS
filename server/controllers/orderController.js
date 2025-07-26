const Order = require("../models/Order");
const Product = require("../models/Product");
const { Parser } = require("json2csv");

exports.createOrder = async (req, res) => {
  try {
    const { customer, items, paymentCollected } = req.body;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({ customer, items, paymentCollected });

    // Emit real-time status via socket (optional, add io in next step)
    const io = req.app.get("io");
    io.emit("orderPlaced", order);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Emit status update via socket (add later)
    const io = req.app.get("io");
    io.emit("orderStatusUpdated", order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("customer")
    .populate("items.product");
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("customer")
    .populate("items.product");
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
};

exports.exportOrdersCsv = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.product");

    const flatOrders = orders.map((order) => ({
      id: order._id,
      customer: order.customer?.name,
      email: order.customer?.email,
      status: order.status,
      payment: order.paymentCollected,
      createdAt: order.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(flatOrders);

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
