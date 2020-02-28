/*****************************************************************************/
/**********************   FUNCTIONALITY AND STUFF   **************************/
/*****************************************************************************/

// Set the value of the date input to today's date
var inputDate = document.querySelector('#date');
var today = new Date().toISOString().slice(0, 10);
inputDate.value = today;




// Toggle .js-active, toggle also if clicking outside of an active transaction
document.addEventListener('click', function toggleJsActive(e) {

    if (e.target.closest('li.js-transaction')) {

        const TRANSACTION = e.target.closest('li');

        TRANSACTION.classList.toggle('js-active');

        return;
    }

    resetTransactions();
})




// Create and add new transaction
var form = document.querySelector('.js-form');

form.addEventListener('submit', function addNewTransaction(e) {
    e.preventDefault();


    var inputDescription = document.querySelector('#description').value,
        inputAmount = parseInt(document.querySelector('#amount').value),
        inputDate = document.querySelector('#date').value;


    var transaction = new Transaction(inputDescription, inputAmount, inputDate);


    // Push new transaction in transactions array
    transactions.push(transaction);
    console.log(transactions);


    // Push transaction into local storage
    // TK


    // Build the HTML of new transaction
    buildTransactionHTML(transaction);
})





/*****************************************************************************/
/***********************   FUNCTION DECLARATIONS   ***************************/
/*****************************************************************************/

// Array to store the transactions
var transactions = [];





// Create new transaction ID
var idCounter = 0;
function createTransactionId() {
    return ++idCounter;
}





// Build HTML for new transaction 
function buildTransactionHTML(transaction) {

    var transactionsList = document.querySelector('.js-transactions-list');
    var li = document.createElement('li');

    li.className = 'transaction js-transaction ' + (transaction.amount >= 0 ? 'transaction--income' : 'transaction--expense');

    // Build the inner HTML for the li.transaction
    var InnerLiHTML;
    innerLiHTML = '<div class="transaction__group">';
    innerLiHTML += '<p class="transaction__description">' + transaction.desc + '</p>';
    innerLiHTML += '<p class="transaction__date">' + transaction.date + '</p>';
    innerLiHTML += '</div>'; // closing tag .transaction__group
    innerLiHTML += '<p class="transaction__amount">' + transaction.amount;
    innerLiHTML += '<span class="transaction__currency">&euro;</span>';
    innerLiHTML += '</p>'; // closing tag .transaction__amount
    innerLiHTML += '<a href="#" class="transaction__delete .js-transaction__delete>&times;</a>';

    li.insertAdjacentHTML('afterbegin', innerLiHTML);
    transactionsList.prepend(li);

}





// Remove .js-active from transaction when clicking away
function resetTransactions() {

    const TRANSACTIONS = document.querySelectorAll('.js-transaction');

    TRANSACTIONS.forEach(function (transaction) {
        transaction.classList.remove('js-active');
    });
}





// New transaction constructor
function Transaction(description, amount, date) {
    this.id = createTransactionId();
    this.desc = description;
    this.amount = amount;
    this.date = date;
}