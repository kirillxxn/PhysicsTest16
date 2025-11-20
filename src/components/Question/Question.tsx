import React from 'react'
import styles from './Question.module.css'

type QuestionProps = {
	question: {
		number: number
		text: string
		imageUrl?: string
		options: Array<{ label: string; value: number }>
		physicalQuantities?: [string, string]
	}
	answer: [number, number]
	onAnswerChange: (answer: [number, number]) => void
}

const Question: React.FC<QuestionProps> = ({
	question,
	answer,
	onAnswerChange,
}) => {
	const handleFirstChange = (value: number) => {
		onAnswerChange([value, answer[1]])
	}

	const handleSecondChange = (value: number) => {
		onAnswerChange([answer[0], value])
	}

	const renderOptions = (
		selectedValue: number,
		onChange: (value: number) => void,
		name: string
	) => {
		return question.options.map(option => (
			<label key={`${name}-${option.value}`} className={styles.option}>
				<input
					type='radio'
					name={name}
					value={option.value}
					checked={selectedValue === option.value}
					onChange={() => onChange(option.value)}
				/>
				<span>{option.label}</span>
			</label>
		))
	}

	const getImageUrl = (url: string | undefined): string => {
		if (!url) return ''

		const base = import.meta.env.BASE_URL

		if (url.startsWith(base)) {
			return url
		}

		return `${base}${url}`
	}

	const isPhysicalQuantitiesQuestion = !!question.physicalQuantities

	return (
		<div className={styles.question}>
			<h3 className={styles.questionNumber}>Вопрос {question.number}</h3>
			<div className={styles.questionText}>{question.text}</div>

			{question.imageUrl && (
				<div className={styles.imageContainer}>
					<img
						src={getImageUrl(question.imageUrl)}
						alt='Иллюстрация к вопросу'
						onError={e => {
							const target = e.target as HTMLImageElement
							target.style.display = 'none'
							const parent = target.parentElement
							if (parent) {
								parent.style.display = 'none'
							}
						}}
						loading='lazy'
					/>
				</div>
			)}

			{isPhysicalQuantitiesQuestion ? (
				<div className={styles.answerSection}>
					<div className={styles.answerColumn}>
						<h4 className={styles.quantityTitle}>
							{question.physicalQuantities![0]}
						</h4>
						<div className={styles.options}>
							{renderOptions(answer[0], handleFirstChange, 'first')}
						</div>
					</div>

					<div className={styles.answerColumn}>
						<h4 className={styles.quantityTitle}>
							{question.physicalQuantities![1]}
						</h4>
						<div className={styles.options}>
							{renderOptions(answer[1], handleSecondChange, 'second')}
						</div>
					</div>
				</div>
			) : (
				<div className={styles.statementsSection}>
					<h4 className={styles.statementsTitle}>
						Выберите верные утверждения:
					</h4>
					<div className={styles.statementsList}>
						{question.options.map(option => (
							<label key={option.value} className={styles.statementOption}>
								<input
									type='checkbox'
									checked={answer.includes(option.value)}
									onChange={e => {
										let newAnswer: [number, number]

										if (e.target.checked) {
											if (answer[0] === 0) {
												newAnswer = [option.value, answer[1]]
											} else if (answer[1] === 0) {
												newAnswer = [answer[0], option.value]
											} else {
												newAnswer = [answer[0], option.value]
											}
										} else {
											if (answer[0] === option.value) {
												newAnswer = [answer[1], 0]
											} else if (answer[1] === option.value) {
												newAnswer = [answer[0], 0]
											} else {
												newAnswer = [...answer] as [number, number]
											}
										}
										onAnswerChange(newAnswer)
									}}
									disabled={
										!answer.includes(option.value) &&
										answer[0] !== 0 &&
										answer[1] !== 0
									}
								/>
								<span>{option.label}</span>
							</label>
						))}
					</div>
					<div
						className={`
						${styles.selectionHint} 
						${answer.filter(val => val !== 0).length === 2 ? styles.success : ''}
						${answer.filter(val => val !== 0).length > 2 ? styles.warning : ''}
					`}
					>
						Выбрано: {answer.filter(val => val !== 0).length} из 2
						{answer.filter(val => val !== 0).length === 2 && ' ✓'}
					</div>
				</div>
			)}
		</div>
	)
}

export default Question
