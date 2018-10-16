

/* Simulating ES5 MVC framwork as well as object oriented structure*/

var modelController = (function() {

    // object contructor for budget
    function Budget() {

        // PRIVATE VARIABLES
        var total = 0;
        var totalIncome = 0;
        var totalExpenses = 0;
        var incomePercent = 0;
        var expensesPercent = 0;
        var incomeRecords = [];
        var expenseRecords = [];
        var recordID = 0;

        // PRIVATE FUNCTIONS

        // Object contructor for a record object
        function Record(sign, description, value, id) {
            this.sign = sign;
            this.description = description;
            this.value = value;
            this.id = id;
        }

        // Unique ID generator
        function generateID() {
            return ++recordID;
        }

        function searchCallback(element) {
            return (element.id === this.id);
        }

        function calculateBudget() {
            resetTotals();
            totalIncome = incomeRecords.length === 0 ? 0 : incomeRecords.reduce(function(accu, ele) { return (accu + ele.value)}, 0);
            totalExpenses =  expenseRecords.length === 0 ?  0 : expenseRecords.reduce(function(accu, ele) { return (accu + ele.value)}, 0);
            incomePercent = (totalIncome/(totalIncome + totalExpenses)) * 100;
            expensesPercent = (totalExpenses/(totalExpenses + totalIncome)) * 100;
            total = totalIncome - totalExpenses;
        }

        function resetTotals() {
            total = 0;
            totalIncome = 0;
            totalExpenses = 0;
            incomePercent = 0;
            expensesPercent = 0;
        }

        // PUBLIC FUNCTIONS
        this.testing = function() {
            console.log( incomeRecords.reduce(function(acc, ele) { return (acc + ele.value)}, 0) ); 
        }

        this.addRecord = function(sign, description, value) {
            if (sign === '+') {
                incomeRecords.push(new Record(sign, description, value, generateID()));
                calculateBudget();
                return recordID;
            }
            else if (sign === '-') {
                expenseRecords.push(new Record(sign, description, value, generateID()));
                calculateBudget();
                return recordID;
            }
            else {
                console.log("Error sign was neither + or negative");
            }

        }

        this.deleteRecord = function (id) {            
            if (incomeRecords.findIndex(searchCallback, {id: id}) !== -1) {
                incomeRecords.splice( incomeRecords.findIndex(searchCallback, {id: id}), 1);
                calculateBudget();
            }
            else if (expenseRecords.findIndex(searchCallback, {id: id}) !== -1) {
                expenseRecords.splice( expenseRecords.findIndex(searchCallback, {id: id}), 1);
                calculateBudget();
            }
            else {
                console.log("Error ID provided is not found")
            }        
        }

        this.showBudget = function() {
            console.log("********** START **********")
            console.log(" Total : " + total);
            console.log(" Total income : " + totalIncome);
            console.log(" Total expense: " + totalExpenses);
            console.log(" Total income percent: " + incomePercent);
            console.log(" Total expense percent: " + expensesPercent);
            console.log(" income records : " + incomeRecords.length);
            console.log(" expense records : " + expenseRecords.length);
            console.log("*********** END ***********")
        }

        
        // DEFININING GETERS AND SETERS
        Object.defineProperties(this, {
            total: {
                get: function() {return total;},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            totalIncome: {
                get: function() {return totalIncome;},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            totalExpenses: {
                get: function() {return totalExpenses},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            }
        });
    }

    console.log("this is inside model controller")
    return new Budget();
    
})();



var viewController = (function() {
    
    var incomeContainer = document.querySelector('.income');
    var expenseContainer =  document.querySelector('.expense');

    function View() {

        this.renderRecord = function(sign, description, value, id) {

        } 
    }


})();

var controller = (function() {
    
})();


