import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
  stock_quantity: z.number().int().min(0, 'Stock must be 0 or more'),
  low_stock_threshold: z.number().int().min(0, 'Threshold must be 0 or more'),
});

export class ProductController {
  async list(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const products = await productService.listProducts(userId);
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      if (typeof id !== 'string') return res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
      const product = await productService.getProduct(userId, id);
      if (!product) return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const validatedData = productSchema.parse(req.body);
      const product = await productService.createProduct(userId, validatedData);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      if (typeof id !== 'string') return res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
      const validatedData = productSchema.partial().parse(req.body);
      const product = await productService.updateProduct(userId, id, validatedData);
      if (!product) return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      if (typeof id !== 'string') return res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
      const success = await productService.deleteProduct(userId, id);
      if (!success) return res.status(404).json({ success: false, error: { message: 'Product not found' } });
      res.json({ success: true, data: { message: 'Product deleted successfully' } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const productController = new ProductController();
