// Array to store the transactions
var transactions = [];

// On DOMContentLoad populate the transaction-list with array items
document.addEventListener("DOMContentLoaded", function buildTransactions() {
  var transactionsList = document.querySelector(".js-transactions-list");

  // Add a message if there are no transactions in the transactions array
  if (transactions.length === 0) {
    showEmptyMessage();
  } else {
    for (var i = 0; i < transactions.length; i++) {
      var transaction = transactions[i];
      var transactionHTML = buildTransactionHTML(transaction);
      transactionsList.prepend(transactionHTML);
    }
  }

  updateBalanceView(tallyNumbers);
});

// Toggle .js-active on transaction click, remove .js-active if click outside
// transactionsList
document.addEventListener("click", function toggleJsActive(e) {
  // If click happens outside the transactions list area, remove
  // .js-active class on all transactions
  if (!e.target.closest(".js-transactions-list")) {
    // Function to remove .js-active class on all transactions
    removeJsActiveAll();
    return;
  }

  var transactions = document.querySelectorAll(".js-transaction");
  var clickedTransaction = e.target.closest("li");

  // If we clicked on empty space between transactions, remove the .js-active
  // and return
  if (clickedTransaction === null) {
    removeJsActiveAll();
    return;
  }

  clickedTransaction.classList.toggle("js-active");

  // Loop through all transactions and remove '.js-active' except the clicked
  // transaction
  for (var i = 0; i < transactions.length; i++) {
    var transaction = transactions[i];

    // If transaction === clicked transaction, skip to next iteration
    if (
      transaction.dataset.transactionId ===
      clickedTransaction.dataset.transactionId
    )
      continue;

    transaction.classList.remove("js-active");
  }
});

// Show new transaction section when clicking on the 'new transaction button'
var newTransactionButton = document.querySelector(".js-new-transaction__btn");

newTransactionButton.addEventListener(
  "click",
  function makeNewTransactionSectionVisible(e) {
    toggleNewTransactionSection();

    // Set the input's value to today if empty
    if (!inputDate.value) setToday();
  }
);

// Hide 'new transaction section' when clicking on black background
var newTransactionSection = document.getElementById("new-transaction");
newTransactionSection.addEventListener(
  "click",
  function hideNewTransactionSection(e) {
    if (!e.target.matches("#new-transaction")) return;

    // Select 'new transaction' section
    var newTransactionSection = document.getElementById("new-transaction");

    // Only toggle '.js-shown' if the section is shown
    if (newTransactionSection.classList.contains("js-shown"))
      toggleNewTransactionSection();
  }
);

// Hide 'new transaction section' when pressing escape button
document.addEventListener("keydown", function hideNewTransactionSection(e) {
  if (e.keyCode === 27) {
    // Select 'new transaction' section
    var newTransactionSection = document.getElementById("new-transaction");

    // Only toggle '.js-shown' if the section is shown
    if (newTransactionSection.classList.contains("js-shown"))
      toggleNewTransactionSection();
  }
});

// Add/edit new transaction
var form = document.querySelector(".js-form");

form.addEventListener("submit", function addEditNewTransaction(e) {
  e.preventDefault();

  // checkInputs returns true if inputs pass the validity checks,
  // otherwise returns false, preventing the transaction from being
  // added or edited -- if false, shows the user what needs to be
  // corrected
  if (checkInputs()) {
    // fire the 'formdata' event
    new FormData(form);
  } else {
    return;
  }
});

form.addEventListener("formdata", function manipulateData(e) {
  var data = e.formData;
  var transactionsList = document.querySelector(".js-transactions-list");
  var transactionData = [];

  // Populate the transactionsData array
  for (var item of data.values()) transactionData.push(item);

  if (form.dataset.editMode === "true") {
    // Get active transaction id
    var activeId = form.dataset.activeTransactionId;

    // Set the id as the last item of the transactionData
    // array. We need to do this since the id must be last
    // element of the arguments array for the new transaction
    // constructor
    transactionData.push(activeId);

    // Save the active transaction reference value in activeTransaction,
    // so that we can update it in the next step
    var activeTransaction = transactions.find(function (transaction) {
      return transaction.id == activeId;
    });

    // Update transaction in the transactions array
    updateTransactionObject.call(activeTransaction, transactionData);

    // Get the active transaction from the DOM
    var activeDomTransaction = document.querySelector(
      `[data-transaction-id="${activeId}"]`
    );

    // Rebuild the HTML with buildTransactionHTML from the updated
    // transaction object
    var updatedHTML = buildTransactionHTML(activeTransaction);

    activeDomTransaction.replaceWith(updatedHTML);
  } else {
    // Delete empty message if adding first transaction
    if (isFirstTransaction()) {
      deleteEmptyMessage();
    }

    var newTransaction = new Transaction(...transactionData);

    // Put the new transaction at the beginning of the transactions array
    transactions.unshift(newTransaction);

    // Get the new transaction's HTML
    var newTransactionHTML = buildTransactionHTML(newTransaction);

    // Put the new transaction at the top of the Activity List
    transactionsList.prepend(newTransactionHTML);
  }

  // Update balance view
  updateBalanceView(tallyNumbers);

  // Remove the popup after the new transaction is added
  toggleNewTransactionSection();
});

// Reset the form and toggle .js-shown from the new transaction section
form.addEventListener("reset", function discardForm(e) {
  toggleNewTransactionSection();
});

document.addEventListener("transaction-deleted", function () {
  var transactionsList = document.querySelector(".js-transactions-list");

  // If transactions list has transactions, do nothing
  // Otherwise, display no transactions message
  if (transactionsList.childElementCount) return;

  showEmptyMessage();
});

/*****************************************************************************/
/***********************   FUNCTION DECLARATIONS   ***************************/
/*****************************************************************************/

// Set the value of the date input to today's date
var inputDate = document.querySelector("#date");
function setToday() {
  var today = new Date().toISOString().slice(0, 10);
  inputDate.value = today;
}

// Format input date
function formatDate(transactionDate) {
  transactionDate = transactionDate.split("-");
  transactionDate.reverse();
  transactionDate = transactionDate.join("/");
  return transactionDate;
}

// Reverse format date (when we edit the transaction)
function reverseFormatDate(date) {
  date = date.split("/");
  date.reverse();
  date = date.join("-");

  return date;
}

// Create new transaction ID
var idCounter = 0;
function createTransactionId() {
  return ++idCounter;
}

// Transaction constructor
function Transaction(
  description,
  category,
  amount,
  date,
  id = createTransactionId()
) {
  this.id = id;
  this.desc = description;
  this.category = category;
  this.amount = parseInt(amount);
  this.date = date;
}

// Update the transaction object in the transactions array
// Use the .call() method to bind 'this' to the transaction object
function updateTransactionObject(data) {
  [this.desc, this.category, this.amount, this.date, this.id] = data;
  this.id = parseInt(this.id);
  this.amount = parseInt(this.amount);
}

// Build HTML for new transaction
function buildTransactionHTML(transaction) {
  var transactionsList = document.querySelector(".js-transactions-list");
  var li = document.createElement("li");
  li.className =
    "transaction js-transaction " +
    (transaction.category === "income"
      ? "transaction--income"
      : "transaction--expense");
  li.dataset.transactionId = transaction.id;

  // Create p element that will store the user's transaction description (to
  // prevent malicious code injection)
  var p = document.createElement("p");
  p.className = "transaction__description";
  p.textContent = transaction.desc;

  // Build the inner HTML for the li.transaction
  var innerLiHTML;
  innerLiHTML = '<div class="transaction__group">';
  innerLiHTML += p.outerHTML;
  innerLiHTML +=
    '<p class="transaction__date">' + formatDate(transaction.date) + "</p>";
  innerLiHTML += "</div>"; // closing tag .transaction__group
  innerLiHTML += '<p class="transaction__amount">' + transaction.amount;
  innerLiHTML += '<span class="transaction__currency">&euro;</span>';
  innerLiHTML += "</p>"; // closing tag .transaction__amount
  innerLiHTML += '<div class="transaction__buttons">';
  innerLiHTML +=
    '<a href="#" class="transaction__edit js-transaction__edit">Edit</a>';
  innerLiHTML +=
    '<a href="#" class="transaction__delete js-transaction__delete">&times;</a>';
  innerLiHTML += "</div>"; // closing tag .transaction__buttons

  li.insertAdjacentHTML("afterbegin", innerLiHTML);

  // Add event listener to edit button
  var editButton = li.querySelector(".js-transaction__edit");
  editButton.addEventListener("click", openEditModal);

  // Add event listener to delete button
  var deleteButton = li.querySelector(".js-transaction__delete");
  deleteButton.addEventListener("click", deleteTransaction);

  // return the built up li to be used in the transaction adding/editing
  // process
  return li;

  // transactionsList.prepend(li);
}

// Delete transaction functionality
function deleteTransaction() {
  // Delete button
  var deleteButton = this;
  var editButton = this.previousElementSibling;

  // Remove the event listener from delete and edit buttons
  deleteButton.removeEventListener("click", deleteTransaction);
  editButton.removeEventListener("click", openEditModal);

  //Select the transaction (li)
  var transaction = this.closest("li");

  // NOTICE: attributes can only store a string value (transactionId is
  // a string, not a number)
  // For comparisons, either convert it to a number or use the loose equality
  // operator to coerce the value to a number
  var transactionId = transaction.dataset.transactionId;

  // Remove transaction from the DOM
  transaction.remove();

  // Remove transaction object from transactions array
  for (var tr of transactions) {
    // Use loose equality operator to allow for coercion
    if (tr.id == transactionId) {
      var transactionIndex = transactions.indexOf(tr);

      transactions.splice(transactionIndex, 1);
    }
  }

  // Let the application know that a transaction was deleted. We use this signal to
  // check whether the last transaction was deleted from the list so that we can show
  // the empty transaction list message
  document.dispatchEvent(
    new CustomEvent("transaction-deleted", { bubbles: true })
  );

  // Update the balance view
  updateBalanceView(tallyNumbers);
}

// Edit transaction functionality
function openEditModal() {
  // Get transaction data (id, desc, amount and date)
  var activeTransaction = this.closest("li");
  var id, desc, category, amount, date;

  id = activeTransaction.dataset.transactionId;

  category = activeTransaction.classList.contains("transaction--income")
    ? "income"
    : "expense";

  var transactionData = activeTransaction.getElementsByTagName("p");

  for (var item of transactionData) {
    switch (item.className) {
      case "transaction__amount":
        amount = item.textContent;
        // Remove currency symbol from the end
        amount = amount.slice(0, -1);
        // Convert to integer
        amount = parseInt(amount);
        break;

      case "transaction__date":
        date = item.textContent;
        // Format the date so we can use it in date input
        date = reverseFormatDate(date);
        break;

      case "transaction__description":
        desc = item.textContent;
        break;
    }
  }

  // Populate form inputs with transaction data
  var form = document.querySelector("form");

  // Select expense/income radio input based on transaction category
  // and check it
  var radioInput = document.getElementById(category);
  radioInput.checked = true;

  var inputs = form.querySelectorAll("input");

  for (var input of inputs) {
    switch (input.id) {
      case "amount":
        input.value = amount;
        break;

      case "date":
        input.value = date;
        break;

      case "description":
        input.value = desc;
        break;
    }
  }

  // open the new transaction window
  toggleNewTransactionSection(true, id);
}

// Tally the numbers and display updated values
function tallyNumbers() {
  var total = (income = expenses = 0);
  transactions.forEach(function (transaction) {
    if (transaction.category === "income") {
      total += transaction.amount;
      income += transaction.amount;
    } else {
      total -= transaction.amount;
      expenses += transaction.amount;
    }
  });

  return [total, income, expenses];
}

function updateBalanceView(tallyCallback) {
  var [balance, income, expenses] = document.querySelectorAll(
    ".js-overview__number"
  );

  [
    balance.textContent,
    income.textContent,
    expenses.textContent,
  ] = tallyCallback();
}

// Remove .js-active from transaction when clicking away
function removeJsActiveAll() {
  const TRANSACTIONS = document.querySelectorAll(".js-transaction");

  TRANSACTIONS.forEach(function (transaction) {
    transaction.classList.remove("js-active");
  });
}

// If we are editing a transaction, we should pass two arguments in order to
// update the form's dataset properties:
// 1) 'true' if we are editing a transaction
// 2) the id of the transaction we are editing
function toggleNewTransactionSection(editMode = false, activeId = null) {
  var newTransactionSection = document.getElementById("new-transaction");
  var form = document.querySelector(".form");
  var sectionTitle = document.querySelector(".form").firstElementChild;
  var submitButton = document.querySelector("[type=submit]");

  // If the first input's value has content in it, we are editing
  // Else (input's value is empty), we are making a new transaction
  // Therefore, update the sectionTitle and submitButton accordingly
  if (document.getElementById("description").value) {
    form.dataset.editMode = editMode;
    form.dataset.activeTransactionId = activeId;
    sectionTitle.textContent = "Edit Transaction";
    submitButton.textContent = "Edit Transaction";
  } else {
    form.dataset.editMode = editMode;
    form.dataset.activeTransactionId = activeId;
    sectionTitle.textContent = "Add New Transaction";
    submitButton.textContent = "Add Transaction";
  }

  // Show/hide New Transaction Section
  newTransactionSection.classList.toggle("js-shown");

  // Reset input fields when hiding the newTransactionSection
  if (newTransactionSection.classList.contains("js-shown") === false)
    resetInputs();
}

function resetInputs() {
  var inputDescription = document.querySelector("#description"),
    inputAmount = document.querySelector("#amount"),
    inputDate = document.querySelector("#date"),
    inputRadioExpense = document.querySelector("#expense");

  inputDescription.value = "";
  inputRadioExpense.checked = true;
  inputAmount.value = "";
  setToday();

  resetValidationStyling();
}

// Function that validates inputs: returns true if all inputs values are valid
// otherweise, returns false
function checkInputs() {
  // Function returns this value in order to signal whether inputs
  // are valid or not. Set to true by default, but if a validation
  // on an imput fails, it is set to false and prevents the transaction
  // from being added/edited
  var allValid = true;

  // Description element and value
  var inputDescription = document.getElementById("description");
  var descriptionValue = inputDescription.value.trim();
  // Amount element and value
  var inputAmount = document.getElementById("amount");
  var amountValue = inputAmount.value.trim();
  // Date element and value
  var inputDate = document.getElementById("date");
  var dateValue = inputDate.value.trim();
  // Radio buttons
  var radioInputs = document.querySelectorAll("input[type=radio]");

  // Check validity of description
  if (descriptionValue === "") {
    showErrorOn(inputDescription, "Description cannot be empty");
    allValid = false;
  } else if (descriptionValue.length > 25) {
    showErrorOn(
      inputDescription,
      "Description must be less than 25 characters"
    );
    allValid = false;
  } else {
    showSuccessOn(inputDescription);
  }

  // Check validity of the amount
  if (amountValue === "") {
    showErrorOn(inputAmount, "Amount cannot be empty");
    allValid = false;
  } else if (!Number(amountValue)) {
    showErrorOn(inputAmount, "Amount must be a number");
    allValid = false;
  } else if (amountValue.startsWith("-", 0)) {
    showErrorOn(inputAmount, "Amount must be positive");
    allValid = false;
  } else {
    showSuccessOn(inputAmount);
  }

  // Check validity of date
  if (dateValue === "") {
    showErrorOn(inputDate, "Date cannot be empty");
    allValid = false;
  } else if (Number(dateValue.slice(0, 4)) < 2000) {
    showErrorOn(inputDate, "Add a transaction from recent history :)");
    allValid = false;
  } else {
    showSuccessOn(inputDate);
  }

  // Check if at least one radio is checked: expense category is
  // checked by default, but in case the user manipulates the DOM
  // we check here if at least one of the radios is checked
  if (!(radioInputs[0].checked || radioInputs[1].checked)) {
    // We will use one element to target the parent container
    showErrorOn(radioInputs[0], "Pick category");
    allValid = false;
  }

  return allValid;
}

function showSuccessOn(input) {
  var parentElement = input.parentElement; // .form__group
  parentElement.className = "form__group success";
}

function showErrorOn(input, message) {
  var parentElement = input.parentElement; // .form__group
  var errorElement = parentElement.querySelector(".form__error-message");
  parentElement.className = "form__group error";
  errorElement.textContent = message;
}

function resetValidationStyling() {
  var formGroups = document.querySelectorAll(".form__group");
  formGroups.forEach(function removeValidationStyles(formGroup) {
    if (formGroup.classList.contains("error"))
      formGroup.classList.remove("error");
    else if (formGroup.classList.contains("success"))
      formGroup.classList.remove("success");
  });
}

function showEmptyMessage() {
  const transactionsList = document.querySelector(".js-transactions-list");
  const message = document.createElement("P");
  message.className = "transactions-list__empty-message js-empty-message";
  message.textContent = "No transactions! Add one?";
  transactionsList.appendChild(message);
}

function isFirstTransaction() {
  // If the empty message exists, it means that the transactions list is empty
  // The expression evaluates to null if the element doesn't exist
  return document.querySelector(".js-empty-message") ? true : false;
}

function deleteEmptyMessage() {
  var message = document.querySelector(".js-empty-message");

  message.remove();
}
