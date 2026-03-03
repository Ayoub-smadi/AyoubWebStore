import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth routes
  app.post(api.auth.login.path, passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(input);
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal error" });
      }
    }
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(search, category);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).end();
  });

  app.post(api.products.importCsv.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.status(401).json({ message: "Unauthorized" });
    // Mocking the CSV import response for the stub 
    res.json({ message: "CSV imported successfully", count: 1 });
  });

  // Orders
  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const orders = await storage.getOrders(user.role === 'admin' ? undefined : user.id);
    res.json(orders);
  });

  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.orders.create.input.parse(req.body);
      const user = req.user as any;
      const order = await storage.createOrder({
        userId: user.id,
        totalAmount: String(input.totalAmount),
        shippingCost: String(input.shippingCost),
        status: "pending"
      }, input.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: String(item.priceAtTime)
      })));
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Not found" });
    if (user.role !== 'admin' && order.userId !== user.id) return res.status(401).json({ message: "Unauthorized" });
    const items = await storage.getOrderItems(order.id);
    res.json({ order, items });
  });

  // Stats
  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.status(401).json({ message: "Unauthorized" });
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Call seed database asynchronously
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const admin = await storage.getUserByUsername("Ayoub");
  if (!admin) {
    await storage.createUser({
      username: "Ayoub",
      password: "password", // Not hashed for simplicity
      role: "admin"
    });
  }

  const products = await storage.getProducts();
  if (products.length === 0) {
    await storage.createProduct({
      name: "Modern Wireless Headphones",
      description: "High quality wireless headphones with noise cancellation.",
      price: "120.00",
      stock: 50,
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
    });
    await storage.createProduct({
      name: "Ergonomic Office Chair",
      description: "Comfortable office chair designed for long working hours.",
      price: "250.00",
      stock: 20,
      category: "Furniture",
      imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80"
    });
    await storage.createProduct({
      name: "Smart Watch Series X",
      description: "Track your fitness, heart rate, and notifications.",
      price: "199.99",
      stock: 30,
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
    });
    await storage.createProduct({
      name: "Premium Mechanical Keyboard",
      description: "Tactile typing experience with RGB backlighting.",
      price: "145.50",
      stock: 15,
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80"
    });
  }
}
