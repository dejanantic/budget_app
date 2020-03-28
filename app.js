/*****************************************************************************/
/**********************   FUNCTIONALITY AND STUFF   **************************/
/*****************************************************************************/

// This can be a function since I use it all the time
// Set the value of the date input to today's date
var inputDate = document.querySelector('#date');
var today = new Date().toISOString().slice(0, 10);
inputDate.value = today;


// Array to store the transactions
var transactions = [
    {
        id: 100,
        desc: 'iPhone',
        amount: -650,
        date: '2020-02-15'
    },
    {
        id: 99,
        desc: 'Salary',
        amount: 2500,
        date: '2020-02-24'
    }
];


// On DOMContentLoad populate the transaction-list with array items
document.addEventListener('DOMContentLoaded', function buildTransactions() {

    for (var i = 0; i < transactions.length; i++) {
        buildTransactionHTML(transactions[i]);
    }

})


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

    // If we clicked on empty space between transactions, remove the .js-active
    // and return
    if (clickedTransaction === null) {

        removeJsActiveAll();
        return;

    }

    clickedTransaction.classList.toggle('js-active');

    // Loop through all transactions and remove '.js-active' except the clicked
    // transaction
    for (var i = 0; i < transactions.length; i++) {

        var transaction = transactions[i];

        // If transaction === clicked transaction, skip to next iteration
        if (transaction.dataset.transactionId === clickedTransaction.dataset.transactionId) continue;

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

form.addEventListener('submit', function addEditNewTransaction(e) {

    // By preventing the default action, we have to reset the form if we want
    // to clear the previous user input TK
    e.preventDefault();


    var inputDescription = document.querySelector('#description').value,
        inputAmount = parseInt(document.querySelector('#amount').value),
        inputDate = document.querySelector('#date').value;

    if (form.dataset.mode === 'edit-transaction') {

        var activeTransactionId = form.dataset.activeTransactionId;

        // Update transaction object in transactions array
        for (var transaction of transactions) {

            if (transaction.id == form.dataset.activeTransactionId) {

                transaction.amount = inputAmount;
                transaction.date = inputDate;
                transaction.desc = inputDescription;

            }
        }

        // Update transaction's data in the DOM
        var DOMTransactions = document.querySelectorAll('.js-transaction');

        for (var DOMTransaction of DOMTransactions) {

            // We are looking for the active transaction with the active ID
            if (DOMTransaction.dataset.transactionId == activeTransactionId) {

                // Getting all the transaction's data 
                var DOMTransactionData = DOMTransaction.getElementsByTagName('p');

                for (var data of DOMTransactionData) {

                    switch (data.className) {
                        case 'transaction__description':
                            data.textContent = inputDescription;
                            break;

                        case 'transaction__date':
                            data.textContent = formatDate(inputDate);
                            break;

                        case 'transaction__amount':
                            // The transaction's class has to update, depending on the updated amount (income
                            // if positive, expense if negative)
                            if (inputAmount >= 0) {

                                DOMTransaction.className = 'transaction js-transaction transaction--income';

                            } else {

                                DOMTransaction.className = 'transaction js-transaction transaction--expense';

                            }

                            // We must use the .innerHTML since we have to add the currency symbol to the amount
                            data.innerHTML = `${inputAmount}<span class="transaction__currency">&euro;</span>`;
                            break;
                    }

                }

            }
        }

        // Reset the form's dataset to default
        resetFormDataset();

    } else {    // If we are not editing an existing transaction, we are making
        // a new one

        var transaction = new Transaction(inputDescription, inputAmount, inputDate);


        // Push new transaction in transactions array
        transactions.unshift(transaction);
        console.log(transactions);


        // Push transaction into local storage
        // TK


        // Build the HTML of new transaction
        buildTransactionHTML(transaction);

    }


    // Remove the popup after the new transaction is added
    toggleNewTransactionSection();

    // Reset the inputs so we don't see the previous input values
    resetInputs();
})


// Reset the form and toggle .js-shown from the new transaction section
form.addEventListener('reset', function discardForm(e) {

    toggleNewTransactionSection();

})


/*****************************************************************************/
/***********************   FUNCTION DECLARATIONS   ***************************/
/*****************************************************************************/


// Create new transaction ID
var idCounter = 0;
function createTransactionId() {
    return ++idCounter;
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

// Reverse format date (when we edit the transaction)
function reverseFormatDate(date) {
    date = date.split('/');
    date.reverse();
    date = date.join('-');

    return date;
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
    innerLiHTML += '<div class="transaction__buttons">';
    innerLiHTML += '<a href="#" class="transaction__edit js-transaction__edit">Edit</a>';
    innerLiHTML += '<a href="#" class="transaction__delete js-transaction__delete">&times;</a>';
    innerLiHTML += '</div>'; // closing tag .transaction__buttons

    li.insertAdjacentHTML('afterbegin', innerLiHTML);

    // Add event listener to edit button
    var editButton = li.querySelector('.js-transaction__edit');
    editButton.addEventListener('click', openEditModal)

    // Add event listener to delete button
    var deleteButton = li.querySelector('.js-transaction__delete');
    deleteButton.addEventListener('click', deleteTransaction)


    transactionsList.prepend(li);
}

// Delete transaction functionality
function deleteTransaction() {


    // Delete button
    var deleteButton = this;


    // Remove the event listener from delete button
    deleteButton.removeEventListener('click', deleteTransaction);


    //Select the transaction (li)
    var transaction = this.closest('li');


    // NOTICE: attributes can only store a string value (transactionId is
    // a string, not a number)
    // For comparisons, either convert it to a number or use the loose equality
    // operator to coerce the value to a number
    var transactionId = transaction.dataset.transactionId;


    // Remove transaction from the DOM
    transaction.remove();


    for (var tr of transactions) {

        // Use loose equality operator to allow for coercion
        if (tr.id == transactionId) {

            var transactionIndex = transactions.indexOf(tr);

            // I am mutating an array here ... don't know if that's ok
            transactions.splice(transactionIndex, 1);

        }

    }

}

// Edit transaction functionality
function openEditModal() {

    // open the new transaction window
    toggleNewTransactionSection(); // Maybe add a flag to change the title of the section

    // Get transaction data (id, desc, amount and date)
    var activeTransaction = this.closest('li');
    var id, desc, amount, date;

    id = activeTransaction.dataset.transactionId;


    var transactionData = activeTransaction.getElementsByTagName('p');

    for (var item of transactionData) {
        switch (item.className) {
            case 'transaction__amount':
                amount = item.textContent;
                // Remove currency symbol from the end
                amount = amount.slice(0, -1);
                // Convert to integer
                amount = parseInt(amount);
                break;

            case 'transaction__date':
                date = item.textContent;
                // Format the date so we can use it in date input
                date = reverseFormatDate(date);
                break;

            case 'transaction__description':
                desc = item.textContent;
                break;
        }
    }

    // Populate form inputs with transaction data
    var form = document.querySelector('form');
    form.dataset.mode = 'edit-transaction';
    form.dataset.activeTransactionId = id;

    var inputs = form.querySelectorAll('input');

    for (var input of inputs) {
        switch (input.id) {
            case 'amount':
                input.value = amount;
                break;

            case 'date':
                input.value = date;
                break;

            case 'description':
                input.value = desc;
                break;
        }
    }

    console.log(date, desc, amount);

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

function resetFormDataset() {

    var form = document.querySelector('.js-form');

    form.dataset.mode = 'new-transaction';
    form.dataset.activeTransactionId = '';

}

function resetInputs() {

    var inputDescription = document.querySelector('#description'),
        inputAmount = document.querySelector('#amount'),
        inputDate = document.querySelector('#date');

    inputDescription.value = '';
    inputAmount.value = '';
    inputDate.value = today;

}