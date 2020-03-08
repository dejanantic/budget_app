/*****************************************************************************/
/**********************   FUNCTIONALITY AND STUFF   **************************/
/*****************************************************************************/

// Set the value of the date input to today's date
var inputDate = document.querySelector('#date');
var today = new Date().toISOString().slice(0, 10);
inputDate.value = today;

document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < transactions.length; i++) {
        buildTransactionHTML(transactions[i]);
    }

    var editTriggers = document.getElementsByClassName('transaction__group');
    for (var i = 0; i < editTriggers.length; i++) {
        editTriggers[i].addEventListener('click', function (e) {
            e.stopPropagation();
            var transactionID = e.target.closest('li').getAttribute('data-transaction-id');
            for (var j = 0; j < transactions.length; j++) {
                if (transactions[j].id === Number(transactionID, 10)) {
                    activeTransaction = transactions[j];
                    toggleNewTransactionSection();
                    document.querySelector('#description').value = activeTransaction.desc;
                    document.querySelector('#amount').value = parseInt(activeTransaction.amount);
                    inputDate = document.querySelector('#date').value = activeTransaction.date.split('/').reverse().join('-');
                    addNewTransaction(activeTransaction);
                }
            }
        });
    }
});

// Toggle .js-active on transaction click, remove .js-active if click outside
// transactionsList
document.addEventListener('click', function toggleJsActive(e) {

    // If click happens outside the transactions list area, remove
    // .js-active class on all transactions
    if (!e.target.closest('.js-transactions-list')) {

        // Function to remove .js-active class on all transactions
        removeJsActiveAll();
        return;

    };

    var transactions = document.querySelectorAll('.js-transaction');
    var clickedTransaction = e.target.closest('li');
    if (clickedTransaction) {
        clickedTransaction.classList.toggle('js-active');
    }

    // Loop through all transactions and remove '.js-active' except the clicked
    // transaction
    for (var i = 0; i < transactions.length; i++) {

        var transaction = transactions[i];

        if (clickedTransaction) {
            // If transaction === clicked transaction, skip to next iteration
            if (transaction.dataset.transactionId === clickedTransaction.dataset.transactionId) continue;
        }

        transaction.classList.remove('js-active');
    }

})


// Show new transaction section when clicking on the 'new transaction button'
var newTransactionButton = document.querySelector('.js-new-transaction__btn');

newTransactionButton.addEventListener('click', function makeNewTransactionSectionVisible(e) {

    toggleNewTransactionSection();

    // Set the input's value to today if empty
    if (!inputDate.value) inputDate.value = today;

})

// Hide 'new transaction section' when pressing escape button
var newTransactionSection = document.getElementById('new-transaction');

document.addEventListener('keydown', function hideNewTransactionSection(e) {

    if (e.keyCode === 27) {

        // Select 'new transaction' section
        var newTransactionSection = document.getElementById('new-transaction');

        // Only toggle '.js-shown' if the section is shown
        if (newTransactionSection.classList.contains('js-shown')) toggleNewTransactionSection();
        console.log('here not running');
    }

})

// Hide 'new transaction section' when clicking on black background

newTransactionSection.addEventListener('click', function hideNewTransactionSection(e) {

    if (!e.target.matches('#new-transaction')) return;

    // Select 'new transaction' section
    var newTransactionSection = document.getElementById('new-transaction');

    // Only toggle '.js-shown' if the section is shown
    if (newTransactionSection.classList.contains('js-shown')) toggleNewTransactionSection();

})


// Add new transaction
var form = document.querySelector('.js-form');

form.addEventListener('submit', function (e) {
    // By preventing the default action, we have to reset the form if we want
    // to clear the previous user input TK
    e.preventDefault();
    addNewTransaction(activeTransaction);
    // Remove the popup after the new transaction is added
    toggleNewTransactionSection();

});

function addNewTransaction(activeTransaction) {

    var inputDescription = document.querySelector('#description').value,
        inputAmount = parseInt(document.querySelector('#amount').value),
        inputDate = document.querySelector('#date').value;

    if (activeTransaction.id === null) {
        var transaction = new Transaction(inputDescription, inputAmount, inputDate);

        // Push new transaction in transactions array
        transactions.push(transaction);

        // Push transaction into local storage
        // TK


        // Build the HTML of new transaction
        buildTransactionHTML(transaction);
    } else {
        activeTransaction.desc = inputDescription;
        activeTransaction.amount = inputAmount;
        activeTransaction.date = inputDate;
        activeTransaction = null;
    }
}


// Reset the form and toggle .js-shown from the new transaction section
form.addEventListener('reset', function discardForm(e) {

    toggleNewTransactionSection();

})


// Delete transaction
document.addEventListener('click', function deleteTransaction(e) {

    // If clicked element !== transaction delete button, return
    if (!e.target.classList.contains('js-transaction__delete')) return;

    var deleteBtn = e.target;

    // Select parent Li and delete it
    var parentLi = deleteBtn.closest('li');
    parentLi.remove();

    // TK remove removed transaction from the transactions array
})

var editTriggers = document.getElementsByClassName('transaction__group');
for (var i = 0; i < editTriggers.length; i++) {
    editTriggers[i].addEventListener('click', function (e) {
        e.stopPropagation();
        var transactionID = e.target.closest('li').getAttribute('data-transaction-id');
        for (var j = 0; j < transactions.length; i++) {
            console.log(Number(transactionID, 10));
            if (transactions[i].id === Number(transactionID, 10)) {
                console.log(transactions[i]);
            }
        }
    });
}


/*****************************************************************************/
/***********************   FUNCTION DECLARATIONS   ***************************/
/*****************************************************************************/


// Array to store the transactions
var transactions = [
    {
        id: 99,
        desc: 'Salary',
        amount: 2500.00,
        date: '24/02/2020'
    },
    {
        id: 100,
        desc: 'iPhone',
        amount: -650.30,
        date: '15/02/2020'
    }
];

var activeTransaction = null;


// Create new transaction ID
var idCounter = 0;
function createTransactionId() {
    return ++idCounter;
}


// Reset inputs on new transaction discard
function resetInputs() {
    var inputs = document.querySelectorAll('')
}


// Transaction constructor
function Transaction(description, amount, date) {
    this.id = createTransactionId();
    this.desc = description;
    this.amount = amount;
    this.date = date;
}


// Format input date
function formatDate(transactionDate) {
    transactionDate = transactionDate.split('-');
    transactionDate.reverse();
    transactionDate = transactionDate.join('/');
    return transactionDate;
}


// Build HTML for new transaction 
function buildTransactionHTML(transaction) {

    var transactionsList = document.querySelector('.js-transactions-list');
    var li = document.createElement('li');
    li.className = 'transaction js-transaction ' + (transaction.amount >= 0 ? 'transaction--income' : 'transaction--expense');
    li.dataset.transactionId = transaction.id;

    // Create p element that will store the user's transaction description (to
    // prevent malicious code injection)
    var p = document.createElement('p');
    p.className = 'transaction__description';
    p.textContent = transaction.desc;

    // Build the inner HTML for the li.transaction
    var innerLiHTML;
    innerLiHTML = '<div class="transaction__group">';
    innerLiHTML += p.outerHTML;
    innerLiHTML += '<p class="transaction__date">' + formatDate(transaction.date) + '</p>';
    innerLiHTML += '</div>'; // closing tag .transaction__group
    innerLiHTML += '<p class="transaction__amount">' + transaction.amount;
    innerLiHTML += '<span class="transaction__currency">&euro;</span>';
    innerLiHTML += '</p>'; // closing tag .transaction__amount
    innerLiHTML += '<a href="#" class="transaction__delete js-transaction__delete">&times;</a>';

    li.insertAdjacentHTML('afterbegin', innerLiHTML);
    transactionsList.prepend(li);
}


// Remove .js-active from transaction when clicking away
function removeJsActiveAll() {

    const TRANSACTIONS = document.querySelectorAll('.js-transaction');

    TRANSACTIONS.forEach(function (transaction) {
        transaction.classList.remove('js-active');
    });

}

function toggleNewTransactionSection() {

    var newTransactionSection = document.getElementById('new-transaction');

    newTransactionSection.classList.toggle('js-shown');
}