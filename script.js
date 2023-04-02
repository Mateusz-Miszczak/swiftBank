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

// Containers
const login = document.querySelector('.login');
const navigation = document.querySelector('.navigation');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerModal = document.querySelector('.modal');
const containerModalOverlay = document.querySelector('.modal__overlay');

// Buttons
const buttonLogIn = document.querySelector('.btn__log-in');
const buttonTransfer = document.querySelector('.btn__submit--transfer');
const buttonLoan = document.querySelector('.btn__submit--loan');
const buttonCloseAcc = document.querySelector('.btn__submit--close-acc');
const buttonLogOut = document.querySelector('.btn__submit--logout');
const btnOpenModal = document.querySelector('.btn__modal--show');
const btnCloseModal = document.querySelector('.btn__modal--close');

// Inputs
const loginInputUser = document.querySelector('.login__input--user');
const loginInputPin = document.querySelector('.login__input--pin');

// APP
let currentAccountTrack;
const displayMovements = mvmnts => {
  containerMovements.innerHTML = '';

  mvmnts.forEach((mov, i) => {
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

buttonLogIn.addEventListener('click', e => {
  e.preventDefault();

  currentAccountTrack = accounts.find(
    acc => acc.username === loginInputUser.value
  );

  if (currentAccountTrack.pin === Number(loginInputPin.value)) {
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

  login.classList.toggle('hidden');

  navigation.classList.toggle('hidden');

  containerApp.classList.toggle('hidden');
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
