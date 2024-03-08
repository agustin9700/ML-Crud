const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		
		res.render("products",{"productos":products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const idProduct = req.params.id;
		const productoEncontrado = products.find(product => product.id === +idProduct);
	
		if (productoEncontrado) {
			res.render("detail", { "product": productoEncontrado });
		} else {
			res.status(404).render("error");
		}
	},
	

	// Create - Form to create
	create: (req, res) => {
		
       res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const { name, price, discount, category, description, image } = req.body;
		let newId = products[products.length - 1].id + 1;
		const newProduct = {
			id: +newId,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category: category ? "visited" : "in-sale",
			description: description.trim(),
			image: "default.jpg"
		};
	
		products = [...products, newProduct];
	
		const productsJSON = JSON.stringify(products, null, 3);
		fs.writeFileSync(path.join(__dirname, "../data/productsDataBase.json"), productsJSON, "utf-8");
	
		// Correct the redirect method to res.redirect
		res.redirect("/products/detail/"+newId );
	}
	,

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;
		const productoEncontrado = products.find(producto => producto.id === +id);

		
		res.render("product-edit-form",{productoEncontrado})
	},
	// Update - Method to update
	update: (req, res) => {
		const { id } = req.params;
		const { name, price, discount, category, description, image } = req.body;
	
		const actualizandoProducto = products.map(producto => {
			if (producto.id === +id) {
				return {
					...producto,
					name: name.trim() || producto.name,
					price: +price || producto.price,
					discount: +discount || producto.discount,
					category: category || producto.category,
					description: description.trim() || producto.description,
					image: image || producto.image
				};
			}
			return producto;
		});
	
		
		products = actualizandoProducto;
	
		const productsJSON = JSON.stringify(products, null, 3);
		fs.writeFileSync(path.join(__dirname, "../data/productsDataBase.json"), productsJSON, "utf-8");
	
		res.redirect("/products/detail/"+id);
	},
	

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		const { id } = req.params;
		const productoEliminar = products.filter(producto => producto.id !== +id);
		
		// Actualiza el array de productos con los productos restantes
		products = productoEliminar;
	
		const productsJSON = JSON.stringify(products, null, 3);
		fs.writeFileSync(path.join(__dirname, "../data/productsDataBase.json"), productsJSON, "utf-8");
	
		res.redirect("/products");
	}
	
};

module.exports = controller;