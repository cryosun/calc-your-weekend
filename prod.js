const { createApp } = Vue;
let app_calc = {
	data() {
		return {
			data: {
				persons: [],
				products: [],
			},
			price: {
				persons: {},
				products: {},
				total: 0
			}
		}
	},
	mounted() {
		fetch('http://e91965tr.bget.ru/calc-your-weekend/get_model.php')
			.then(response => response.json())
			.then(
				data => this.data = data
			);
	},
	methods: {
		addNewPerosn() {
			let disabledProduct = [];
			for (let i in this.data.products) {
				disabledProduct.push(parseInt(this.data.products[i].id));
			}
			this.data.persons.push({ name: '', disabledProduct });
			console.log(this.data.persons);
		},
		addNewProduct() {
			this.data.products.push({ name: '', count: 0, price: 0, units: '', id: Date.now() });
		},
		personCalcValues(personKey, prod_id) {
			if (this.data.persons[personKey].disabledProduct !== undefined
				&& !this.inArray(this.data.persons[personKey].disabledProduct, prod_id)
			) {
				// Сформируем массив цен по продуктам для песроны
				this.price.persons[personKey.toString() + '-' + prod_id] = 0;
				return '0';
			}
			let personCount = this.getPerosnCountByProduct(prod_id);
			let product = this.getProdById(prod_id);
			let count = product.count / personCount;
			let price = product.count * product.price / personCount;

			// Сформируем массив цен по продуктам для песроны
			this.price.persons[personKey.toString() + '-' + prod_id] = price;
			let str = product.count === 1 ? '' : count.toFixed(2) + '<sub>' + product.units + '</sub> / ' ;

			return str + price.toFixed(2) + '₽';
		},
		getProdById(prod_id) {
			for (let i in this.data.products) {
				if (this.data.products[i].id === prod_id) {
					return this.data.products[i];
				}
			}
		},
		toggleUse(personKey, prod_id) {
			if (this.data.persons[personKey].disabledProduct === undefined)
				this.data.persons[personKey].disabledProduct = [];

			if (this.inArray(this.data.persons[personKey].disabledProduct, prod_id)) {
				for (let i in this.data.persons[personKey].disabledProduct) {
					if (this.data.persons[personKey].disabledProduct[i] === prod_id) {
						this.data.persons[personKey].disabledProduct.splice(i, 1);
					}
				}
			} else {
				this.data.persons[personKey].disabledProduct.push(prod_id);
			}
		},
		getPerosnCountByProduct(prod_id) {
			let personCount = this.data.persons.length;
			for (let i in this.data.persons) {
				if (this.data.persons[i].disabledProduct === undefined)
					continue;

				if (this.inArray(this.data.persons[i].disabledProduct, prod_id) === false)
					personCount--;
			}
			return personCount;
		},
		inArray(obj, prod_id) {
			for (let i in obj) {
				if (obj[i] === prod_id) {
					return prod_id;
				}
			}

			return false;
		},
		deleteProduct(prod_id) {
			for (let i in this.data.products) {
				if (this.data.products[i].id === prod_id) {
					this.data.products.splice(i, 1);
					break;
				}
			}
		},
		deletePerson(personKey) {
			this.data.persons.splice(personKey, 1)
		},
		save() {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(this.data)
			};
			fetch('http://e91965tr.bget.ru/calc-your-weekend/save.php', requestOptions).then(resp => {
				console.log(resp.data);
			});
		},
		personeSumm(personKey) {
			let summ = 0;
			for (let i in this.data.products) {
				if (this.price.persons[personKey.toString() + '-' + this.data.products[i].id] !== undefined)
					summ += this.price.persons[personKey.toString() + '-' + this.data.products[i].id];
			}

			return summ.toFixed(2);
		},
		prodcutSumm(prod_id) {
			let summ = 0;
			for (let i in this.data.persons) {
				if (this.price.persons[i + '-' + prod_id] !== undefined)
					summ += this.price.persons[i + '-' + prod_id];
			}

			return summ.toFixed(2);
		},
		totalSumm() {
			let total = 0;
			for (let i in this.data.products) {
				total += parseInt(this.prodcutSumm(this.data.products[i].id));
			}

			return total.toFixed(2);
		}
	}
};
const app = createApp(app_calc);
app.mount('#app')