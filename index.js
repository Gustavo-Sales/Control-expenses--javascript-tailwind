const incomes = document.querySelector('#incomes')
const expenses = document.querySelector('#expenses')
const currentBalance = document.querySelector('#current-balance')
const form = document.querySelector('form')
const historic = document.querySelector("#historic")

let data = [];

const getItemsLocalStorage = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItemsLocalStorage = () => localStorage.setItem("db_items", JSON.stringify(data));

const clearInput = (input) => input.value = "";

function currencyFormatting(value) {
  const locale = 'pt-BR'
  const options = {
    style: 'currency',
    currency: 'BRL'
  }

  const formatter = new Intl.NumberFormat(locale, options)

  return formatter.format(value)
}

function getIncomesTotal() {
  const incomesAmount = data
  .filter((obj) => obj.type === 'in')
  .map((obj) => Number(obj.amount))

  const totalIncomes = incomesAmount.reduce((acc, curr) => acc + curr, 0)

  return totalIncomes;
}

function getExpensesTotal() {
  const incomesExpenses = data
  .filter((obj) => obj.type === 'out')
  .map((obj) => Number(obj.amount));

  const totalExpenses = incomesExpenses.reduce((acc, curr) => acc + curr, 0)

  return totalExpenses;
}

function getCurrentBalance(incomes, expenses) {
  const total = incomes - expenses

  return (total < 0 ? 0 : total)
}

function createLi(item) {
  const li = document.createElement("li");
  const p = document.createElement("li")
  const span = document.createElement("span")

  li.setAttribute("class", "flex justify-between p-3 border border-indigo-200 rounded")
  li.classList.add((item.type === "in" ? "text-green-600" : "text-orange-600"))

  p.textContent = item.desc;
  span.textContent = `${(item.type === "in" ? "+" : "-")} ${currencyFormatting(item.amount)}`;

  li.appendChild(p)
  li.appendChild(span)
  historic.appendChild(li)
}

function showInfo(){
  const totalIncomes = getIncomesTotal()
  const totalExpenses = getExpensesTotal()
  const totalCurrentBalance = getCurrentBalance(totalIncomes, totalExpenses)

  incomes.textContent = currencyFormatting(totalIncomes)
  expenses.textContent = currencyFormatting(totalExpenses)
  currentBalance.textContent = currencyFormatting(totalCurrentBalance)
}

function showHistoric() {
  data = getItemsLocalStorage();
  for (let item of data) {
    createLi(item)
  }
}

function app() {
  historic.textContent = ""
  showInfo()
  showHistoric()
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const [desc, amount, type] = form;

  if (desc.value === "" || amount.value === "") {
    alert("Preencha todos os campos!")
    return
  }

  data.push({
    desc: desc.value,
    amount: Number(amount.value),
    type: type.value
  })

  clearInput(desc);
  clearInput(amount);

  setItemsLocalStorage();

  app();
})

app();