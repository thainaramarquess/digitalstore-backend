const { Product, Category, ProductImage, ProductOption } = require('../models');
const { Op } = require('sequelize');

exports.searchProducts = async (req, res) => {
    try {
        const { limit = 12, page = 1, fields, match, category_ids, price_range, option } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (match) {
            where[Op.or] = [
                { name: { [Op.like]: `%${match}%` } },
                { description: { [Op.like]: `%${match}%` } }
            ];
        }
        if (category_ids) {
            where.category_ids = { [Op.overlap]: category_ids.split(',') };
        }
        if (price_range) {
            const [min, max] = price_range.split('-');
            where.price = { [Op.between]: [parseFloat(min), parseFloat(max)] };
        }

        const products = await Product.findAndCountAll({
            where,
            limit: limit === '-1' ? null : parseInt(limit),
            offset: limit === '-1' ? 0 : offset,
            attributes: fields ? fields.split(',') : undefined,
            include: [
                { model: Category, as: 'categories' },
                { model: ProductImage, as: 'images' },
                { model: ProductOption, as: 'options' }
            ]
        });

        res.status(200).json({
            data: products.rows,
            total: products.count,
            limit: limit === '-1' ? products.count : parseInt(limit),
            page: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'categories' },
                { model: ProductImage, as: 'images' },
                { model: ProductOption, as: 'options' }
            ]
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            enabled, name, slug, stock, description, price, price_with_discount,
            category_ids, images, options
        } = req.body;

        const product = await Product.create({
            enabled, name, slug, stock, description, price, price_with_discount
        });

        if (category_ids) {
            await product.setCategories(category_ids);
        }

        if (images) {
            await ProductImage.bulkCreate(images.map(image => ({ ...image, product_id: product.id })));
        }

        if (options) {
            await ProductOption.bulkCreate(options.map(option => ({ ...option, product_id: product.id })));
        }

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const {
            enabled, name, slug, stock, description, price, price_with_discount,
            category_ids, images, options
        } = req.body;

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({
            enabled, name, slug, stock, description, price, price_with_discount
        });

        if (category_ids) {
            await product.setCategories(category_ids);
        }

        if (images) {
            await Promise.all(images.map(async (image) => {
                if (image.id) {
                    if (image.deleted) {
                        await ProductImage.destroy({ where: { id: image.id } });
                    } else {
                        await ProductImage.update(image, { where: { id: image.id } });
                    }
                } else {
                    await ProductImage.create({ ...image, product_id: product.id });
                }
            }));
        }

        if (options) {
            await Promise.all(options.map(async (option) => {
                if (option.id) {
                    if (option.deleted) {
                        await ProductOption.destroy({ where: { id: option.id } });
                    } else {
                        await ProductOption.update(option, { where: { id: option.id } });
                    }
                } else {
                    await ProductOption.create({ ...option, product_id: product.id });
                }
            }));
        }

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

