function example() {
	const a = Math.floor(Math.random() * 20);
	const b = Math.floor(Math.random() * 20);
	return {a,b}
}
function check(data) {
	return data.c === data.a + data.b;
}
function answer(data) {
	return parseInt(prompt(`${data.a} + ${data.b}`));
}
function generateGame() {
	const task = example()
	const reply = answer(task)
	const checked = check({
		...task,
		c: reply
	})
	alert(checked ? '😎' : '🤧')
	// generateGame()
}


generateGame()