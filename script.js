// DATA FOR THE APPLICATION
const account1 = {
  owner: 'Mateusz Miszczak',
  movements: [100, 200, -140, 4000, -1200, -60, 80, 2400],
  interestRate: 1.3, // %
  pin: 1111,
};

const account2 = {
  owner: 'Andrew Huberman',
  movements: [6000, 4300, 20000, -9000, -2500, -2000, 10000, -15],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Jordan Peterson',
  movements: [2000, -100, 40, -600, -10, 5000, 4000, -600],
  interestRate: 1.5,
  pin: 3333,
};

const account4 = {
  owner: 'Howard Hamlin',
  movements: [30000, 10000, 8000, 5000, -9000],
  interestRate: 1.5,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ELEMENTS

// Labels
const labelLogin = document.querySelector('.login__welcome');
const labelNavigation = document.querySelector('.navigation__welcome-message');
const labelBalanceValue = document.querySelector('.balance__value');
const labelDate = document.querySelector('.date');
const labelMovementsDate = document.querySelector('.movements__date');
const labelMovementsValue = document.querySelector('.movements__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTime = document.querySelector('.navigation__time');

// Containers
const login = document.querySelector('.login');
const navigation = document.querySelector('.navigation');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerModal = document.querySelector('.modal');
const containerModalOverlay = document.querySelector('.modal__overlay');
const createForm = document.querySelector('.create__form');

// Buttons
const buttonLogIn = document.querySelector('.btn__log-in');
const buttonSort = document.querySelector('.btn--sort');
const buttonTransfer = document.querySelector('.btn__submit--transfer');
// const buttonTransferSubmit = document.querySelector('.form__btn--transfer');
const buttonLoan = document.querySelector('.btn__submit--loan');
// const buttonLoanSubmit = document.querySelector('.form__btn--loan');
const buttonCloseAcc = document.querySelector('.btn__submit--close-acc');
// const buttonCloseAccSubmit = document.querySelector('.form__btn--close');
const formButton = document.querySelector('.form__btn');
const buttonLogOut = document.querySelector('.btn__submit--logout');
const btnOpenModal = document.querySelector('.btn__modal--show');
const btnCloseModal = document.querySelector('.btn__modal--close');
let currentButton;

// Inputs
const loginInputUser = document.querySelector('.login__input--user');
const loginInputPin = document.querySelector('.login__input--pin');

// APP
let currentAccountTrack;
const displayMovements = (mvmnts, srt = false) => {
  containerMovements.innerHTML = '';

  const movs = srt ? mvmnts.slice().sort((a, b) => a - b) : mvmnts;
  movs.forEach((mov, i) => {
    const type = mov >= 0 ? `deposit` : `withdrawal`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__value">${mov}$</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${incomes}$`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(outcomes)}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(intere => intere >= 1)
    .reduce((acc, inte) => acc + inte, 0);
  labelSumInterest.textContent = `${interest}$`;
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalanceValue.textContent = `${acc.balance}$`;
};

const userCreate = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

userCreate(accounts);

const updateUI = acc => {
  displayMovements(acc.movements);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

const toggleClasses = () => {
  login.classList.toggle('hidden');

  navigation.classList.toggle('hidden');

  containerApp.classList.toggle('hidden');
};

buttonLogIn.addEventListener('click', e => {
  e.preventDefault();

  currentAccountTrack = accounts.find(
    acc => acc.username === loginInputUser.value
  );

  if (currentAccountTrack?.pin === Number(loginInputPin.value)) {
    labelNavigation.textContent = `Welcome back, ${
      currentAccountTrack.owner.split(' ')[0]
    }!`;

    login.classList.toggle('hidden');
    navigation.classList.toggle('hidden');
    containerApp.classList.toggle('hidden');

    loginInputUser.value = loginInputPin.value = '';
    loginInputPin.blur();

    updateUI(currentAccountTrack);
  }
});

buttonLogOut.addEventListener('click', e => {
  e.preventDefault();

  toggleClasses();
});

const openCloseModal = () => {
  containerModal.classList.toggle('modal__hidden');
  containerModalOverlay.classList.toggle('modal__hidden');
};

const closeModal = () => {
  containerModal.classList.add('modal__hidden');
  containerModalOverlay.classList.add('modal__hidden');
};

btnOpenModal.addEventListener('click', openCloseModal);
btnCloseModal.addEventListener('click', openCloseModal);

containerModalOverlay.addEventListener('click', openCloseModal);

document.addEventListener('keydown', e =>
  e.key === 'Escape' && !containerModal.classList.contains('modal__hidden')
    ? closeModal()
    : ''
);

const getCurrentDate = () => {
  const today = new Date();
  const f = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'full',
  });
  let currentDate = f.format(today);
  return currentDate;
};

setInterval(() => {
  labelDate.textContent = getCurrentDate();
}, 1000);

const getCurrentTime = () => {
  const today = new Date();
  const f = new Intl.DateTimeFormat('en-us', {
    timeStyle: 'long',
  });
  let currentTime = f.format(today);
  return currentTime;
};

setInterval(() => {
  labelTime.textContent = getCurrentTime();
}, 1000);

let sorted = false;

buttonSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccountTrack.movements, !sorted);
  sorted = !sorted;
});

const displayForm = (html, formClass) => {
  const transferForm = document.querySelector('.operation--form');
  if (transferForm) {
    transferForm.remove();
  }
  createForm.insertAdjacentHTML('afterbegin', html);
  document.querySelector('.operation').classList.add(formClass);

  const currentButton = document.querySelector('.form__btn');
  currentButton.addEventListener('click', e => {
    e.preventDefault();
    if (currentButton.classList.contains('form__btn--transfer')) {
      const inputTransferTo = document.querySelector('.form__input--to');
      const inputTransferAmount = document.querySelector(
        '.form__input--amount'
      );
      transferTo(inputTransferTo, inputTransferAmount);
    } else if (currentButton.classList.contains('form__btn--loan')) {
      const inputLoanAmount = document.querySelector(
        '.form__input--loan-amount'
      );
      takeLoan(inputLoanAmount);
    } else if (currentButton.classList.contains('form__btn--close')) {
      const inputCloseUsername = document.querySelector('.form__input--user');
      const inputClosePin = document.querySelector('.form__input--pin');
      closeUser(inputCloseUsername, inputClosePin);
    }
  });
};

const formsObj = {
  formTransfer: `
  <div class="operation operation--all">
    <h2 class="form__h2" >Transfer money</h2>
    <form class="form form--transfer">
      <label for="to" class="form__label">Transfer to</label>
      <input type="text" class="form__input form__input--to" id="to"/>
      <label for="amount" class="form__label">Amount</label>
      <input type="number" class="form__input form__input--amount" id="amount"/>
      <button class="btn form__btn form__btn--transfer">&rarr;</button>
    </form>
  </div>`,

  formLoan: `
  <div class="operation operation--all">
    <h2 class="form__h2" >Request loan</h2>
    <form class="form form--loan">
      <label for="loan" class="form__label form__label--loan">Amount</label>
      <input type="number" class="form__input form__input--loan-amount" id="loan"/>
      <button class="btn form__btn form__btn--loan">&rarr;</button>
    </form>
  </div>`,

  formCloseAcc: `
  <div class="operation operation--all">
    <h2 class="form__h2" >Close account</h2>
    <form class="form form--close">
      <label for="confirm-user" class="form__label">Confirm user</label>
      <input type="text" class="form__input form__input--user" id="confirm-user"/>
      <label for="confirm-pin" class="form__label">Confirm PIN</label>
      <input
        type="password"
        maxlength="4"
        class="form__input form__input--pin"
        id="confirm-pin"
      />
      <button class="btn form__btn form__btn--close">&rarr;</button>
    </form>
  </div>`,
};

buttonTransfer.addEventListener('click', e => {
  e.preventDefault();

  displayForm(formsObj.formTransfer, 'operation--form');
});

buttonLoan.addEventListener('click', e => {
  e.preventDefault();

  displayForm(formsObj.formLoan, 'operation--form');
});

buttonCloseAcc.addEventListener('click', e => {
  e.preventDefault();

  displayForm(formsObj.formCloseAcc, 'operation--form');
});

const transferTo = (to, amount) => {
  const amountMoney = Number(amount.value);
  const receiverAcc = accounts.find(acc => acc?.username === to.value);

  amount.value = to.value = '';
  amount.blur();

  if (
    amountMoney > 0 &&
    receiverAcc &&
    currentAccountTrack.balance &&
    receiverAcc?.username !== currentAccountTrack.username
  ) {
    currentAccountTrack.movements.push(-amountMoney);
    receiverAcc.movements.push(amountMoney);

    updateUI(currentAccountTrack);
  }
};

const takeLoan = amount => {
  const amountMoney = Number(amount.value);
  const requestedAmount = currentAccountTrack.movements.some(
    mov => mov >= amountMoney * 0.1
  );

  if (amountMoney > 0 && requestedAmount) {
    currentAccountTrack.movements.push(amountMoney);

    updateUI(currentAccountTrack);
  }
  amount.value = '';
};

const closeUser = (name, pin) => {
  let closeUser = name.value;
  let closeUserPin = Number(pin.value);

  if (
    closeUser === currentAccountTrack.username &&
    closeUserPin === currentAccountTrack.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccountTrack.username
    );

    accounts.splice(index, 1);

    toggleClasses();
  }
  closeUser = closeUserPin = '';
};
