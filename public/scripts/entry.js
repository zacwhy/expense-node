var
  amountInput = document.querySelector('[name=amount]'),
  dateInput = document.querySelector('[name=date]'),
  evaluateAmountInput = document.querySelector('#evaluateAmount'),
  todayButton = document.querySelector('#today');

todayButton.onclick = function () {
  dateInput.valueAsDate = new Date();
};

evaluateAmountInput.onblur = function () {
  amountInput.value = math.eval(evaluateAmountInput.value);
};
