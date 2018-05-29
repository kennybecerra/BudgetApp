/* *********************************************
The code is split into three modules

BudgetController : holds the data structure where the information is stored

UIController :  holds all functionality to change the UI, i.e. adds
or removes income_records

Conttroller : connects the rpevious two modules together, also functions as an initializer
to the page.

***********************************************/

/*Intialization - Immediately invoking functions*/
/* ------------  BUDGET CONTROLLER START -----------  */
var budgetController = (function () {
  var budget = {
    total: 0,
    total_income: 0,
    total_expense: 0,
    income_counter: 0,
    income_records: [],
    income_order_ids: [],
    expense_counter: 0,
    expense_records: [],
    expense_order_ids: [],
    updateTotal: function () {this.total = this.total_income - this.total_expense;}
  };

  /*Budget Record Constructor */
  function Record( desc, amt, id) {
    this.description = desc;
    this.amount = amt;
    this.order_id = id;
  }


    return {
      addRecord: function ( sign, description, amount) {
        if (sign === "plus") {

          budget.income_records.push( new Record (description, amount, "rec_i_" + budget.income_counter));
          budget.income_order_ids.push("rec_i_" + budget.income_counter);
          budget.income_counter++;

          budget.total_income += amount;
          budget.updateTotal();
        }
        else if (sign === "minus") {
          budget.expense_records.push( new Record (description, amount, "rec_e_" + budget.expense_counter));
          budget.expense_order_ids.push("rec_e_" + budget.expense_counter);
          budget.expense_counter++;

          budget.total_expense += amount;
          budget.updateTotal();
        }
        else {
          console.log("there is an issue with the sign of the record");
        }
      },
      removeRecord: function (recordID) {
        if ( budget.income_order_ids.indexOf(recordID) > 0) {
          budget.income_records.splice(budget.income_order_ids.indexOf(recordID), 1);
          budget.income_order_ids.splice(budget.income_order_ids.indexOf(recordID), 1);
        }
        else if (budget.expense_order_ids.indexOf(recordID) > 0) {
          budget.expense_records.splice(budget.expense_order_ids.indexOf(recordID), 1);
          budget.expense_order_ids.splice(budget.expense_order_ids.indexOf(recordID), 1);
        }
        else {
          console.log("record ID not found in order ids array. Record id is : " + recordID );
        }
      },
      showIncomeCounter: function () {return budget.income_counter;},
      showExpenseCounter: function () {return budget.expense_counter;}
    };

})();

/* ------------  BUDGET CONTROLLER END -----------  */

/* ------------  UI CONTROLLER START -----------  */
var UIController = (function () {

  function ReturnIncomeRecord (description, amount, cur_id) {
    mystring = ["<div class=\"row income-record\" id=\"rec_i_" + cur_id + "\">",
      "<p class=\"item-description\">" + description + "</p>",
      "<p class=\"item-amount\">" + amount + "</p>",
      "<p class=\"item-percent\">%</p>",
      "<button class=\"delete-button\" onclick=\"RemoveItem(this)\"><i class=\"ion-ios-close-outline\"></i></button>",
    "</div>\n"].join("\n");

    return mystring;
  }

  function ReturnExpenseRecord (description, amount, cur_id) {
    mystring = ["<div class=\"row expenses-record\" id=\"rec_e_" + cur_id + "\">",
      "<p class=\"item-description\">" + description + "</p>",
      "<p class=\"item-amount\">" + amount + "</p>",
      "<p class=\"item-percent\">%</p>",
      "<button class=\"delete-button\" onclick=\"RemoveItem(this)\"><i class=\"ion-ios-close-outline\"></i></button>",
    "</div>\n"].join("\n");

    return mystring;
  }


  return {
    add_income_record: function ( description, amount, current_id ) {
      var x = document.querySelector(".income");
        x.innerHTML = x.innerHTML + ReturnIncomeRecord(description, amount, current_id);
    },
    add_expense_record: function ( description, amount, current_id ) {

      var x = document.querySelector(".expense");
        x.innerHTML = x.innerHTML + ReturnExpenseRecord(description, amount, current_id);
    }
  };

})();
/* ------------  UI CONTROLLER END -----------  */

/* ------------ CONTROLLER START -----------  */
var controller = (function (Budgetctrl, UIctrl) {

  /* This Code sets the current montha dn year in top of the page.*/
  var d = new Date();
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById("month").innerHTML = months[d.getMonth()];
  document.getElementById("year").innerHTML = d.getFullYear();


  /*Event listener for input field check mark */
  document.querySelector(".add-button").addEventListener("click", function() {
    var Sign = document.querySelector(".my-dropdown").value;
    var Description = document.querySelector(".my-description").value;
    var Amount = document.querySelector(".my-amount").value;
    var current = Budgetctrl.showIncomeCounter();

    if (Sign === "plus") {
      UIctrl.add_income_record(Description , Amount, current);
      //document.querySelector("#rec_i_" + current).addEventListener("click", function() {});
      Budgetctrl.addRecord(Sign, Description, Amount);
    }
    else if ( Sign ==="minus") {
      UIctrl.add_expense_record(Description , Amount, current);
      Budgetctrl.addRecord(Sign, Description, Amount);
    }
    else {
      console.log("issue in the controller, plus or minues sign does not work");
    }

  });


})(budgetController, UIController);
/* ------------ CONTROLLER END -----------  */

/* This functrion is used to remove a record from the tables*/
function RemoveItem(self) {
  console.log(self);
  var child = self.parentNode;
  child.parentNode.removeChild(child);
}
