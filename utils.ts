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

function shuffleArray<T>(originalArray: ReadonlyArray<T>): T[] {
	let array = [...originalArray];  // Create a copy

	for (let i = array.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}

	return array;
}

export { getUserInput, getWeeklyDate, shuffleArray };