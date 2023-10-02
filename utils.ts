const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function getUserInput(): number[] {
	let prompt: string = 'Is there a holiday this week? (1 for yes, 0 for no): ';
	const holidayExists: boolean = rl.question(prompt, (answer: string) => {
		rl.close();
		return !!parseInt(answer);
	})

	if (holidayExists) {
		prompt = 'Which days (except for 土日)? (separated by space, use "0 1 2 3 4 5"): ';
		const days: number[] = rl.question(prompt, (answer: string) => {
			rl.close();
			return answer.split(' ').forEach(day => {
				return parseInt(day);
			});
		});
		return days;
	}

	return [];
}

function getWeeklyDate(): Date[] {
	const thisWeeksMonday = new Date();
	thisWeeksMonday.setDate(thisWeeksMonday.getDate() - thisWeeksMonday.getDay() + 1);

	const thisWeekDates: Date[] = [];

	for (let i = 0; i < 5; i++) {
		thisWeekDates.push(new Date(thisWeeksMonday));
		thisWeeksMonday.setDate(thisWeeksMonday.getDate() + 1);
	}
	return thisWeekDates;
}

export { getUserInput, getWeeklyDate };