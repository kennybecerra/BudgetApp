

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
            this.percent = 0;
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
            totalIncome = Math.round(totalIncome * 100) / 100;
            totalExpenses =  expenseRecords.length === 0 ?  0 : expenseRecords.reduce(function(accu, ele) { return (accu + ele.value)}, 0);
            totalExpenses = Math.round(totalExpenses * 100) / 100;
            incomePercent = Math.round((totalIncome/(totalIncome + totalExpenses)) * 10000) /100;
            expensesPercent = Math.round((totalExpenses/(totalExpenses + totalIncome)) * 10000)/100;
            total = totalIncome - totalExpenses;
            total = Math.round(total * 100) /100;

            incomeRecords.forEach( function(current) {
                current.percent = Math.round((current.value / totalIncome) * 10000) /100;
            });

            expenseRecords.forEach(function(current){
                current.percent = Math.round((current.value / totalExpenses) * 10000) /100;
            });
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

        this.getRecordInfo = function(id) {
            if (incomeRecords.findIndex(searchCallback, {id: id}) !== -1) {
                return JSON.parse(JSON.stringify(incomeRecords[incomeRecords.findIndex(searchCallback, {id: id})]));  
            }
            else if (expenseRecords.findIndex(searchCallback, {id: id}) !== -1) {
                return JSON.parse(JSON.stringify(expenseRecords[expenseRecords.findIndex(searchCallback, {id: id})])); 
            }
            else {
                return null;
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
            console.log(this);
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
            },
            incomePercent: {
                get: function() {return incomePercent},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            expensesPercent: {
                get: function() {return expensesPercent},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            incomeRecords: {
                get: function() {return incomeRecords},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            expenseRecords: {
                get: function() {return expenseRecords},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            }

        });
    }

    console.log("this is inside model controller")
    return new Budget();
    
})();



var viewController = (function() {
    
    /* ALl of these variables return an Element object */
    var incomeContainer = document.querySelector('.income');
    var expenseContainer =  document.querySelector('.expense');

    var dropdownContainer = document.getElementById('mydropdown');
    var descriptionContainer = document.getElementById('description');
    var amountContainer = document.getElementById('amount');

    var totalContainer = document.querySelector('.total');
    var totalIncomeContainer = document.querySelector('.total-income');
    var totalIncomePercentContainer = document.querySelector('.total-income-percent');
    var totalExpensesContainer = document.querySelector('.total-expenses');
    var totalExpensesPercentContainer = document.querySelector('.total-expenses-percent');
    


    var dropdown = '';
    var description = '';
    var amount = 0;

    function View() {

        /* PRIVATE FUNCTIONS */
        function deleteRecord(id) {         
            Array.prototype.forEach.call(incomeContainer.children, function (ele) {
                if ( parseInt(ele.dataset.id) === id) {
                    incomeContainer.removeChild(ele);
                }
            });

            Array.prototype.forEach.call( expenseContainer.children, function (ele) {
                if ( parseInt(ele.dataset.id) === id) {
                    expenseContainer.removeChild(ele);
                }
            });
        }

        /* PUBLIC FUNCTION TO BE USED BY THE CONTROLLER*/

        this.setDeleteButton = function(id, callback) {
            Array.prototype.forEach.call(incomeContainer.children, function (ele) {
                if ( parseInt(ele.dataset.id) === id) {
                    ele.querySelector('.delete-button').onclick = function() {
                        deleteRecord(id);
                        callback();
                    }

                }
            });

            Array.prototype.forEach.call(expenseContainer.children, function (ele) {
                if ( parseInt(ele.dataset.id) === id) {
                    ele.querySelector('.delete-button').onclick = function() {
                        deleteRecord(id);
                        callback();
                    }
                }
            });
        }

        this.renderTotals = function(total = 0, totalIncome = 0, incomePercent = 0, totalExpenses = 0, expesnesPercent = 0) {
            totalContainer.innerHTML = Number.isNaN(total) ? 0 : total;
            totalIncomeContainer.innerHTML = Number.isNaN(totalIncome) ? 0 : `+ ${totalIncome}`;
            totalIncomePercentContainer.innerHTML = Number.isNaN(incomePercent) ? "0 %" :  `${incomePercent} %`;
            totalExpensesContainer.innerHTML =  Number.isNaN(totalExpenses) ? 0 : `- ${totalExpenses}`;
            totalExpensesPercentContainer.innerHTML = Number.isNaN(expesnesPercent) ? "0 %" : `${expesnesPercent} %`;
        }

        this.getNewRecordInfo = function() {
            dropdown = dropdownContainer.value
            description = descriptionContainer.value;
            amount = parseFloat(parseFloat(amountContainer.value).toFixed(2));
        }

        this.renderRecord = function(sign, description, value, percent, id) {
            var template =  `
            <div class="row ${sign === '+' ? 'income':'expenses'}-record" data-id=${id}>
                <p class="item-description">${description}</p>
                <p class="item-amount">${value}</p>
                <p class="item-percent">${percent}%</p>
                <button class="delete-button"><i class="ion-ios-close-outline"></i></button>
            </div>`;
            if (sign === "+") {
                incomeContainer.insertAdjacentHTML('beforeend', template);
                //setDeleteButton(id);
            }
            else if (sign == "-") {
                expenseContainer.insertAdjacentHTML('beforeend', template);
                //setDeleteButton(id);
            }
            else {
                console.log("error occured when adding a record to the UI")
            }
        } 

        this.updateAllRecords = function(incomeArray, expenseArray) {

            incomeArray.forEach(function(record) {
                Array.prototype.forEach.call(incomeContainer.children, function (ele) {
                    if ( parseInt(ele.dataset.id) === record.id) {
                        ele.querySelector('.item-percent').innerHTML = `${record.percent} %`;
                    }
                });
            });

            expenseArray.forEach(function(record) {
                Array.prototype.forEach.call(expenseContainer.children, function (ele) {
                    if ( parseInt(ele.dataset.id) === record.id) {
                        ele.querySelector('.item-percent').innerHTML = `${record.percent} %`;
                    }
                });
            });
        }

        // DEFININING GETERS AND SETERS
        Object.defineProperties(this, {
            dropdown: {
                get: function() {return dropdown;},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            description: {
                get: function() {return description;},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            },
            amount: {
                get: function() {return amount},
                set: function(value) {console.log("Not allowed to set this property"); return undefined}
            }
        });
    }

    return new View();


})();

var controller = (function( model, view) {
    view.renderTotals();
    document.getElementById('button').addEventListener('click', function () {
        var recordID = 0;
        var record = {}; 
        view.getNewRecordInfo();
        recordID = model.addRecord(view.dropdown, view.description, view.amount);
        record = model.getRecordInfo(recordID);
        view.renderRecord(record.sign , record.description, record.value, record.percent, record.id);
        view.setDeleteButton(recordID, runUpdate);
        view.updateAllRecords(model.incomeRecords , model.expenseRecords);
        view.renderTotals(model.total, model.totalIncome, model.incomePercent, model.totalExpenses, model.expensesPercent);


        function runUpdate() {
            //console.log(model.incomeRecords);
            model.deleteRecord(recordID);
            view.updateAllRecords(model.incomeRecords , model.expenseRecords);
            view.renderTotals(model.total, model.totalIncome, model.incomePercent, model.totalExpenses, model.expensesPercent);
        };
    });

})(modelController, viewController);


