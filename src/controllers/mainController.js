const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {

		const productsInSale = products.filter(p => p.category === "in-sale")
		const productsVisited = products.filter(p => p.category === "visited")
		
		res.render("index",{productsInSale,productsVisited})
	},
	search: (req, res) => {
		
		let busqueda = req.query.keywords.toLowerCase(); // Convertir a minúsculas
	
		let resultadosBusqueda = [];
	
		for (let i = 0; i < products.length; i++) {
			let nombreProducto = products[i].name.toLowerCase();
			let categoriaProducto = products[i].category.toLowerCase();
	
			if (nombreProducto.includes(busqueda) || categoriaProducto.includes(busqueda)) {
				resultadosBusqueda.push(products[i]);
			}
		}
	
		res.render("results",{resultadosBusqueda,busqueda});
	}
}

module.exports = controller
