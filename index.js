class Example {
	min = 0;
	max = 0;
	a = 0;
	b = 0;
	c = 0;
	constructor(min, max) {
		this.min = min;
		this.max = max;
	}
	getRandomInt() {
		const min = Math.ceil(this.min);
		const max = Math.floor(this.max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	generate() {
		this.a = this.getRandomInt();
		this.b = this.getRandomInt();
		this.c = this.a + this.b;
	}
	check(answer) {
		return this.c === parseInt(answer);
	}
}

class IO {
	answer(data) {
		return prompt(`${data.a} + ${data.b}`);
	}
	result(checked) {
		alert(checked ? '😎' : '🤧')
	}
}

function generateGame() {
	const example = new Example(2,9)
	const io = new IO()
	example.generate()
	const answer = io.answer({a: example.a, b: example.b})
	const checked = example.check(answer)
	io.result(checked)
}

generateGame()
