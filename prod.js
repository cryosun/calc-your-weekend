const { createApp } = Vue;
let app_calc = {
	data() {
		return {
			data: {
				persons: [],
				products: [],
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
			this.data.persons.push({ name: '' });
		},
		addNewProduct() {
			this.data.products.push({ name: '', count: 0, price: 0, units: '' });
		},
		personCalcValues(personKey, productKey) {
			if (
				this.data.persons[personKey].disabledProduct !== undefined
				&& this.data.persons[personKey].disabledProduct[productKey] !== undefined
			) {
				return '0';
			}
			let personCount = this.getPerosnCountByProduct(productKey);
			let product = this.data.products[productKey];
			let count = product.count / personCount;
			let price = product.count * product.price / personCount;
			return count.toFixed(2) + product.units + ' / ' + price.toFixed(2) + '₽';
		},
		toggleUse(personKey, productKey) {
			if (this.data.persons[personKey].disabledProduct === undefined)
				this.data.persons[personKey].disabledProduct = [];

			if (this.data.persons[personKey].disabledProduct[productKey] !== undefined) {
				for (let i in this.data.persons[personKey].disabledProduct) {
					delete this.data.persons[personKey].disabledProduct[productKey];
				}
			} else {
				this.data.persons[personKey].disabledProduct[productKey] = true;
			}
			console.log(this.data.persons[personKey].disabledProduct);
		},
		getPerosnCountByProduct(productKey) {
			let personCount = this.data.persons.length;
			for (let i in this.data.persons) {
				if (this.data.persons[i].disabledProduct === undefined) {
					continue;
				}
				if (this.data.persons[i].disabledProduct[productKey] !== undefined) {
					personCount--;
				}
			}
			return personCount;
		},
		deleteProduct(productKey) {
			this.data.products.splice(productKey, 1)
		},
		deletePerson(personKey) {
			this.data.persons.splice(personKey, 1)
		},
		save() {
			console.log(this.data);
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(this.data)
			};
			fetch('http://e91965tr.bget.ru/calc-your-weekend/save.php', requestOptions).then(resp => {
				console.log(resp.data);
			});
		}
	}
};
const app = createApp(app_calc);
app.mount('#app')