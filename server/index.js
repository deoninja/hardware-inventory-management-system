const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes will go here

// Dashboard Stats
app.get('/api/dashboard', async (req, res) => {
  try {
    const totalItems = await prisma.item.count();
    const lowStockItems = await prisma.item.count({
      where: {
        quantity: { lt: prisma.item.fields.minStockLevel }
      }
    });

    // Calculate total value
    const items = await prisma.item.findMany();
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const recentMovements = await prisma.movement.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { item: true }
    });

    res.json({ totalItems, lowStockItems, totalValue, recentMovements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Items CRUD
app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        supplier: true,
        location: true
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { name, sku, categoryName, supplierName, locationName, quantity, price, minStockLevel } = req.body;

    // Find or create category
    let category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    // Handle Supplier
    let supplierId = null;
    if (supplierName) {
      let supplier = await prisma.supplier.findUnique({ where: { name: supplierName } });
      if (!supplier) {
        supplier = await prisma.supplier.create({ data: { name: supplierName } });
      }
      supplierId = supplier.id;
    }

    // Handle Location
    let locationId = null;
    if (locationName) {
      let location = await prisma.location.findUnique({ where: { name: locationName } });
      if (!location) {
        location = await prisma.location.create({ data: { name: locationName } });
      }
      locationId = location.id;
    }

    const item = await prisma.item.create({
      data: {
        name,
        sku,
        categoryId: category.id,
        supplierId,
        locationId,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        minStockLevel: parseInt(minStockLevel)
      }
    });

    // Log initial movement
    await prisma.movement.create({
      data: {
        itemId: item.id,
        type: 'IN',
        quantity: parseInt(quantity)
      }
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, categoryName, supplierName, locationName, quantity, price, minStockLevel } = req.body;

    // Determine if quantity changed to log movement
    const currentItem = await prisma.item.findUnique({ where: { id: parseInt(id) } });
    if (!currentItem) return res.status(404).json({ error: 'Item not found' });

    const newQuantity = parseInt(quantity);

    if (newQuantity !== currentItem.quantity) {
      const diff = newQuantity - currentItem.quantity;
      await prisma.movement.create({
        data: {
          itemId: parseInt(id),
          type: diff > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(diff)
        }
      });
    }

    // Update relations if provided
    let categoryId = currentItem.categoryId; // Keep existing if not provided (though usually provided in full update)
    if (categoryName) {
      let category = await prisma.category.findUnique({ where: { name: categoryName } });
      if (!category) category = await prisma.category.create({ data: { name: categoryName } });
      categoryId = category.id;
    }

    let supplierId = currentItem.supplierId;
    if (supplierName) {
      let supplier = await prisma.supplier.findUnique({ where: { name: supplierName } });
      if (!supplier) supplier = await prisma.supplier.create({ data: { name: supplierName } });
      supplierId = supplier.id;
    }

    let locationId = currentItem.locationId;
    if (locationName) {
      let loc = await prisma.location.findUnique({ where: { name: locationName } });
      if (!loc) loc = await prisma.location.create({ data: { name: locationName } });
      locationId = loc.id;
    }

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name,
        sku,
        categoryId,
        supplierId,
        locationId,
        quantity: newQuantity,
        price: parseFloat(price),
        minStockLevel: parseInt(minStockLevel)
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movement.deleteMany({ where: { itemId: parseInt(id) } });
    await prisma.item.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New Endpoints for Dropdowns
app.get('/api/suppliers', async (req, res) => {
  const suppliers = await prisma.supplier.findMany();
  res.json(suppliers);
});

app.get('/api/locations', async (req, res) => {
  const locations = await prisma.location.findMany();
  res.json(locations);
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { items: true } } }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
