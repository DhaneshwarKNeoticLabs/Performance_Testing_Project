/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.15789473684211, "KoPercent": 1.8421052631578947};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9005, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice"], "isController": false}, {"data": [0.59, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice"], "isController": false}, {"data": [0.21, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype"], "isController": false}, {"data": [0.86, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO"], "isController": false}, {"data": [0.0, 500, 1500, "Manage Invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1"], "isController": false}, {"data": [1.0, 500, 1500, "Add invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1900, 35, 1.8421052631578947, 232.21052631578925, 1, 9020, 7.5, 557.6000000000013, 1902.0499999999856, 4276.210000000001, 11.376904883087333, 56.586301682584356, 7.0898069107212365], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 50, 1, 2.0, 1216.8799999999997, 643, 3319, 882.0, 2120.7, 2572.5999999999976, 3319.0, 0.4940223298093074, 0.15438197806540857, 0.3623152047722557], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice", 50, 0, 0.0, 47.199999999999996, 38, 195, 42.0, 51.699999999999996, 78.74999999999986, 195.0, 0.4984846067953422, 0.14506680939942573, 1.7656285828581113], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 50, 3, 6.0, 1107.9399999999998, 420, 3603, 734.0, 2878.4999999999995, 3254.3999999999983, 3603.0, 0.49431048630265645, 0.3219776312147186, 0.24087981705568903], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 50, 16, 32.0, 2716.76, 913, 9020, 2077.0, 5303.2, 8776.449999999999, 9020.0, 0.4922907272118623, 2.1677137587873894, 0.24085708430970992], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty", 50, 0, 0.0, 25.040000000000006, 9, 98, 18.0, 60.29999999999999, 70.59999999999997, 98.0, 0.49846472863580177, 0.15820413750648002, 0.3305249518981537], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 150, 0, 0.0, 13.086666666666662, 3, 139, 5.0, 30.80000000000001, 67.0499999999999, 123.70000000000027, 0.9103875216217037, 0.480976219919279, 0.3811062346372106], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid", 50, 0, 0.0, 264.24, 42, 921, 95.0, 716.9, 806.8999999999997, 921.0, 0.49799804784765245, 0.12401318574331188, 0.22711434408677117], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 50, 0, 0.0, 3.2199999999999998, 1, 17, 2.0, 6.899999999999999, 12.449999999999996, 17.0, 0.49616957091255504, 0.12258877093835589, 0.22046597145040286], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv", 50, 0, 0.0, 13.020000000000003, 7, 37, 9.0, 26.9, 32.89999999999999, 37.0, 0.4966574950582579, 3.609012129617673, 0.2376583716587367], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 50, 0, 0.0, 19.999999999999993, 7, 131, 11.5, 40.49999999999999, 69.94999999999996, 131.0, 0.4967364415788271, 0.12369901621347745, 0.2507936916955602], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities", 50, 0, 0.0, 3.42, 2, 18, 2.0, 6.0, 14.14999999999997, 18.0, 0.4967413765697027, 0.12273004714075662, 0.21683925324868858], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 50, 15, 30.0, 3095.5800000000004, 2238, 7303, 2578.5, 4585.099999999999, 5884.1999999999925, 7303.0, 0.398066986712524, 1.2525115538942893, 0.21030687481589402], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 50, 0, 0.0, 5.300000000000002, 3, 22, 4.0, 7.0, 15.249999999999979, 22.0, 0.40526520555051226, 0.10764857022435481, 0.15870248772046427], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1", 50, 0, 0.0, 10.559999999999999, 6, 36, 7.0, 18.799999999999997, 30.449999999999996, 36.0, 0.4958743256109171, 19.786547797326246, 0.18159460166415425], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice", 50, 0, 0.0, 15.899999999999991, 9, 56, 10.0, 33.9, 39.0, 56.0, 0.4958300691187117, 19.98233915272558, 0.39511458632897334], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0", 50, 0, 0.0, 4.960000000000003, 2, 49, 3.0, 8.0, 16.799999999999983, 49.0, 0.49585957256904845, 0.19756904844548026, 0.21354889795209997], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice", 50, 0, 0.0, 14.219999999999999, 9, 48, 11.0, 25.29999999999999, 36.14999999999997, 48.0, 0.4052060878162633, 16.295299508079808, 0.34466260008590366], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO", 50, 0, 0.0, 3.8000000000000007, 1, 18, 2.0, 14.399999999999991, 15.449999999999996, 18.0, 0.49619911478077916, 0.12259607035111049, 0.17832155687434253], "isController": false}, {"data": ["Manage Invoice", 50, 21, 42.0, 8716.499999999996, 4542, 18340, 6737.0, 15652.3, 17492.049999999996, 18340.0, 0.47450035113025985, 30.89303116162431, 8.482157155702545], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount", 50, 0, 0.0, 16.64, 5, 159, 9.0, 35.29999999999999, 44.64999999999993, 159.0, 0.496835160030605, 0.13245702996909686, 0.24259529298369387], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 100, 0, 0.0, 3.290000000000001, 1, 19, 2.0, 7.0, 12.0, 18.969999999999985, 0.6074448440081641, 0.15008158743561084, 0.26931636638643214], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData", 50, 0, 0.0, 3.1000000000000005, 2, 15, 2.0, 6.899999999999999, 8.899999999999991, 15.0, 0.49876804293395316, 0.12323077623270522, 0.22990089478986903], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 150, 0, 0.0, 3.273333333333334, 1, 20, 2.0, 7.0, 10.0, 17.960000000000036, 0.9112226177603363, 0.2358144469789933, 0.3746335176534195], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 50, 0, 0.0, 2.7800000000000002, 1, 17, 2.0, 6.599999999999994, 9.349999999999987, 17.0, 0.40527506018334647, 0.1001314357679557, 0.14089640764186653], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice", 50, 0, 0.0, 9.7, 7, 39, 8.0, 11.899999999999999, 18.799999999999983, 39.0, 0.49872326843281195, 0.12321971378271625, 1.4645125665795564], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0", 50, 0, 0.0, 5.199999999999998, 3, 29, 4.0, 9.0, 14.249999999999979, 29.0, 0.40526849037487334, 0.1614741641337386, 0.17572188449848025], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1", 50, 0, 0.0, 8.84, 6, 36, 7.0, 14.799999999999997, 22.14999999999997, 36.0, 0.4052454977225203, 16.135419368303317, 0.16898420656984], "isController": false}, {"data": ["Add invoice", 50, 0, 0.0, 77.94000000000001, 28, 320, 66.5, 141.59999999999997, 249.4499999999999, 320.0, 0.4945451668100847, 21.454277290238668, 2.055936303818878], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode", 50, 0, 0.0, 11.439999999999996, 3, 104, 6.0, 19.699999999999996, 52.19999999999985, 104.0, 0.49620403910087835, 0.38572110851982333, 0.21708926710663426], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice", 100, 0, 0.0, 43.46999999999999, 12, 256, 28.5, 80.60000000000002, 158.1499999999998, 255.53999999999976, 0.9923489892925544, 2.1353915995177184, 0.47243176980480495], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice", 50, 0, 0.0, 30.340000000000003, 10, 120, 18.5, 71.99999999999999, 99.59999999999997, 120.0, 0.4963863076800889, 0.14687993283893258, 0.23849810876816777], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 100, 0, 0.0, 3.120000000000001, 1, 20, 2.0, 5.0, 13.899999999999977, 19.95999999999998, 0.5994664748373948, 0.1481103692713485, 0.26636449809669394], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 50, 0, 0.0, 19.080000000000002, 5, 261, 10.0, 46.49999999999999, 57.849999999999945, 261.0, 0.49735902358476497, 0.17145286652873243, 0.2501366183067909], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,835 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,807 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,474 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,386 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,517 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,329 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,076 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 7,303 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,148 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,071 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,047 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,211 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,060 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,492 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,962 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,319 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,313 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 9,020 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,514 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,612 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,603 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,585 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,593 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,773 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,480 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,629 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,844 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,321 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 8,731 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,277 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,572 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,872 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,359 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 8,832 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,198 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.857142857142857, 0.05263157894736842], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1900, 35, "The operation lasted too long: It took 3,835 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,807 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,474 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,386 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,517 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 50, 1, "The operation lasted too long: It took 3,319 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 50, 3, "The operation lasted too long: It took 3,603 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,060 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,492 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 50, 16, "The operation lasted too long: It took 3,835 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,474 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,612 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,386 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,585 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 50, 15, "The operation lasted too long: It took 4,807 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,593 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,076 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 7,303 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,148 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
