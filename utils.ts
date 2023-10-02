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
		prompt = 'Which days (except for 土日)? (separated by space, use "0 1 2 3 4"): ';
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

function getWeeklyDate(): string[] {
	const touDate = new Date();
	// set date to monday
	touDate.setDate(touDate.getDate() - touDate.getDay() + 1);

	const thisWeekDates: Date[] = Array<Date>(5);

	for (let i = 0; i < 5; i++) {
		thisWeekDates[i] = new Date(touDate);
		touDate.setDate(touDate.getDate() + 1);
	}

	const thisWeekDatesFormatted: string[] = thisWeekDates.map(date => {
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
	})

	getUserInput().forEach(day => {
		thisWeekDatesFormatted[day] = "yasumi";
	})

	return thisWeekDatesFormatted;
}

export { getUserInput, getWeeklyDate };