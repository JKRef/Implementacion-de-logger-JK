import { Router } from 'express';
import { isAdmin } from '../middleware/isAdmin.js';
import { passportCall } from '../utils.js';
import ProductController from '../controllers/products.controller.js';


const router = Router();

// -- get all products
router.get('/', ProductController.getAllProducts); 

// -- get a product by ID
router.get('/:id', ProductController.getProductByID);

// -- add a new product
router.post('/', passportCall('current'), isAdmin, ProductController.addProduct);

// -- edit a product information
router.put('/:id', passportCall('current'), isAdmin, ProductController.editProduct);

// -- delete a product from the list
router.delete('/:id', passportCall('current'), isAdmin, ProductController.deleteProduct);

export default router;