class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.currentNumber = ''
    this.opString = ''
    this.operation = undefined
  }

  setCurrentNumber(number) {
    this.currentNumber = number.toString()
  }

  appendOpString(str) {
    this.opString = this.opString + str
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
    this.currentNumber = this.currentOperand
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    if (current == 0 && this.operation == '÷') {
      this.currentNumber = "undefined"
    }
    else {

      this.opString = this.opString.replace('−', '-')
      this.opString = this.opString.replace('x', '*')
      this.opString = this.opString.replace('÷', '/')
      this.currentOperand = bodmas(this.opString)
      this.currentNumber = bodmas(this.opString)
      this.operation = undefined
      this.previousOperand = ''

    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    if (this.getDisplayNumber(this.currentOperand).length > 10) {
      this.throwError("Error")
      return
    }
    this.currentOperandTextElement.innerText = this.currentNumber
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }

  throwError(err) {
    this.currentOperandTextElement.innerText = err
  }
}

function bodmas(equation) {
  var failsafe = 100;
  var num = '(((?<=[*+-])-|^-)?[0-9.]+)';
  var reg = new RegExp(num + '([*/])' + num);

  while (m = reg.exec(equation)) {
    var n = (m[3] == "*") ? m[1] * m[4] : m[1] / m[4];
    equation = equation.replace(m[0], n);
    if (failsafe-- < 0) { return 'failsafe'; }
  }

  var reg = new RegExp(num + '([+-])' + num);
  while (m = reg.exec(equation)) {
    var n = (m[3] == "+") ? 1 * m[1] + 1 * m[4] : m[1] - m[4];
    equation = equation.replace(m[0], n);
    if (failsafe-- < 0) { return 'failsafe'; }
  }

  return equation;
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const currentOperand2TextElement = document.querySelector('[data-current2-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
// let chars = [];
// let ints = []
// const stack = new Stack(program)
let opString = ''

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.setCurrentNumber(button.innerText)
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
    // program.push(button.innerHTML)
    calculator.appendOpString(button.innerText)
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
    // program.push(button.innerHTML)
    calculator.appendOpString(button.innerText)
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})