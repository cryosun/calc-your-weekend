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
				totalPersons: 0,
				totalProducts: 0
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
			for (let productKey in this.data.products) {
				disabledProduct.push(parseInt(productKey));
			}
			this.data.persons.push({ name: '', disabledProduct });
			console.log(this.data.persons);
		},
		addNewProduct() {
			this.data.products.push({ name: '', count: 0, price: 0, units: '' });
		},
		personCalcValues(personKey, productKey) {
			if (this.data.persons[personKey].disabledProduct !== undefined
				&& !this.inArray(this.data.persons[personKey].disabledProduct, productKey)
			) {
				// Сформируем массив цен по продуктам для песроны
				this.price.persons[personKey.toString() + '-' + productKey] = 0;
				return '0';
			}
			let personCount = this.getPerosnCountByProduct(productKey);
			let product = this.data.products[productKey];
			let count = product.count / personCount;
			let price = product.count * product.price / personCount;

			// Сформируем массив цен по продуктам для песроны
			this.price.persons[personKey.toString() + '-' + productKey] = price;

			return count.toFixed(2) + '<sub>' + product.units + '</sub> / ' + price.toFixed(2) + '₽';
		},
		toggleUse(personKey, productKey) {
			if (this.data.persons[personKey].disabledProduct === undefined)
				this.data.persons[personKey].disabledProduct = [];

			if (this.inArray(this.data.persons[personKey].disabledProduct, productKey)) {
				for (let i in this.data.persons[personKey].disabledProduct) {
					if (this.data.persons[personKey].disabledProduct[i] === productKey) {
						this.data.persons[personKey].disabledProduct.splice(i, 1);
					}
				}
			} else {
				this.data.persons[personKey].disabledProduct.push(productKey);
			}
		},
		getPerosnCountByProduct(productKey) {
			let personCount = this.data.persons.length;
			for (let i in this.data.persons) {
				if (this.data.persons[i].disabledProduct === undefined)
					continue;

				if (this.inArray(this.data.persons[i].disabledProduct, productKey) === false)
					personCount--;
			}
			return personCount;
		},
		inArray(obj, k) {
			for (let i in obj) {
				if (obj[i] === k) {
					return i;
				}
			}

			return false;
		},
		deleteProduct(productKey) {
			this.data.products.splice(productKey, 1)
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
				if (this.price.persons[personKey.toString() + '-' + i] !== undefined)
					summ += this.price.persons[personKey.toString() + '-' + i];
			}

			return summ.toFixed(2);
		},
		prodcutSumm(productKey) {
			let summ = 0;
			for (let i in this.data.persons) {
				if (this.price.persons[i + '-' + productKey] !== undefined)
					summ += this.price.persons[i + '-' + productKey];
			}

			return summ.toFixed(2);
		}
	}
};
const app = createApp(app_calc);
app.mount('#app')