sap.ui.define(["demo/manageproducts/controller/BaseController"], function (Controller) {
    "use strict";
    return Controller.extend("demo.manageproducts.controller.List", {}); 
});

onInit: function final() {
    this.getRouter().getRoute("List").attachMatched(this._onRouteMatched, this); 
    var oModel = new JSONModel({
        deleteEnabled: false,
        busy: false
    });
    this.setModel(oModel, "viewModel");         
}

_onRouteMatched: function final () {
    this._doRefresh()
} 

_doRefresh: function final () {
    this.setProperty("viewModel", "busy", true); 
    this.sendXMLHttpRequest('GET', '/node-pg/products')
    .then((response)=> {
        var products = JSON.parse(response)
        this.getView().setModel(new JSONModel(products))
        var oSorter = new Sorter("id")
        oSorter.fnCompare = function(value1, value2) {
            if (value1 < value2) return -1;
            if (value1 == value2) return 0;
            if (value1 > value2) return 1;                    
        }
        this.byId("table").getBinding("items").sort(oSorter)
        this.setProperty("viewModel", "busy", false);   
    })
    .catch(error => {
        this.handleError(error)
    })
}