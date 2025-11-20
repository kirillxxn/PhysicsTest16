export type QuestionOption = {
	label: string
	value: number
}

export type Question = {
	id: string
	number: number
	text: string
	imageUrl?: string
	options: QuestionOption[]
	correctAnswer: [number, number]
	physicalQuantities?: [string, string]
}

export type UserAnswer = {
	answer: [number, number]
	isCorrect: boolean
}

export type TestState = {
	currentQuestion: number
	answers: { [key: number]: UserAnswer }
	showResults: boolean
	timeSpent: number
	mode: 'test' | 'review' | 'mistakes'
	mistakeQuestions: number[]
}

export type TestResults = {
	correct: number
	total: number
	percentage: number
	mistakes: number[]
}
