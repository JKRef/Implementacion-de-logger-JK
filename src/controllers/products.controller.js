import ProductValidator from "../dao/validators/product.validator.js";

class ProductsController{
    async getAllProducts(req,res){
        try{
            const {page, limit, sort, category, status} = req.query;
            req.logger.debug(`Got the following values, these are optional \npage: ${page}, limit: ${limit}, sort: ${sort}, queries: { category: ${category}, status: ${status} }`)

            const products = await ProductValidator.getProducts({ page, limit, sort, category, status });
            req.logger.info('Got the products!')
            res.status(200).json(products);
        }catch(err){
            req.logger.error(err.message)
            res.status(500).json(err)
        }
    }

    async getProductByID(req, res){
        try{
            const id = req.params.id;

            const product = await ProductValidator.getProductByID(id);
            res.status(200).json(product);
        }catch(err){
            req.logger.error(err.message)
            res.status(500).json(err)
        }
    }

    async addProduct(req, res){
        try{
            const {title, description, code, price, status, stock, category, thumbnails} = req.body;

            const product = await ProductValidator.createProduct({title, description, code, price, stock, status, category, thumbnails});
            req.logger.info('Product added to the DB')
            res.status(200).json(product);
        }catch(err){
            req.logger.error(err.message)
            res.status(500).json(err)
        }
    }

    async editProduct(req, res){
        try{
            const id = req.params.id;
            const {title, description, code, price, stock, category, thumbnails} = req.body;

            const product = await ProductValidator.updateProduct(id, {title, description, code, price, stock, category, thumbnails});
            req.logger.info(`Product ${id} information updated`)
            res.status(200).json(product);
        }catch(err){
            req.logger.error(err.message)
            res.status(500).json({error: err.message})
        }
    }

    async deleteProduct(req, res){
        try{
            const id = req.params.id;

            const product = await ProductValidator.deleteProduct(id);
            res.status(200).json(product);
        }catch(err){
            req.logger.error(err.message)
            res.status(500).json(err)
        }
    }
}

export default new ProductsController();