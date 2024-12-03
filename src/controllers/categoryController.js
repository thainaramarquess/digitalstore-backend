const { Category } = require('../models');

exports.searchCategories = async (req, res) => {
    try {
        const { limit = 12, page = 1, fields, use_in_menu } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (use_in_menu === 'true') {
            where.use_in_menu = true;
        }

        const categories = await Category.findAndCountAll({
            where,
            limit: limit === '-1' ? null : parseInt(limit),
            offset: limit === '-1' ? 0 : offset,
            attributes: fields ? fields.split(',') : undefined
        });

        res.status(200).json({
            data: categories.rows,
            total: categories.count,
            limit: limit === '-1' ? categories.count : parseInt(limit),
            page: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;
        const category = await Category.create({ name, slug, use_in_menu });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.update({ name, slug, use_in_menu });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
