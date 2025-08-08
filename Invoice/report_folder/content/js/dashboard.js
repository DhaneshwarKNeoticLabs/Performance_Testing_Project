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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.89, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice"], "isController": false}, {"data": [0.55, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice"], "isController": false}, {"data": [0.15, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO"], "isController": false}, {"data": [0.0, 500, 1500, "Manage Invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1"], "isController": false}, {"data": [0.9, 500, 1500, "Add invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode"], "isController": false}, {"data": [0.975, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 380, 7, 1.8421052631578947, 233.69210526315788, 2, 5009, 10.5, 678.4000000000002, 1978.449999999999, 4530.9, 4.317396836938738, 21.473812289810944, 2.690495371580167], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 10, 0, 0.0, 1501.6000000000001, 736, 2032, 1496.0, 2027.1, 2032.0, 2032.0, 1.4166312508853944, 0.4426972659016858, 1.0389551459130189], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice", 10, 0, 0.0, 121.6, 40, 348, 49.0, 342.5, 348.0, 348.0, 1.9747235387045812, 0.5746754048183255, 6.994455346563981], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 10, 0, 0.0, 720.9999999999999, 487, 1127, 698.5, 1105.7, 1127.0, 1127.0, 2.1177467174925875, 1.3794307232105039, 1.0319879023718763], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 10, 6, 60.0, 3107.9, 1262, 5009, 3225.0, 4979.2, 5009.0, 5009.0, 1.3163090693694879, 5.796130462682638, 0.6440144958536264], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty", 10, 0, 0.0, 23.4, 11, 43, 19.5, 42.300000000000004, 43.0, 43.0, 1.9758940920766646, 0.6271148241454259, 1.3101875864453665], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 30, 1, 3.3333333333333335, 113.03333333333332, 3, 3069, 7.0, 24.0, 1411.299999999998, 3069.0, 0.3499399269792019, 0.18488037157787912, 0.14649177932788204], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid", 10, 0, 0.0, 312.29999999999995, 35, 911, 209.5, 874.4000000000001, 911.0, 911.0, 1.9470404984423677, 0.4848587178738318, 0.8879569460669782], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 10, 0, 0.0, 4.8, 2, 15, 3.0, 14.300000000000002, 15.0, 15.0, 3.33889816360601, 0.824942612687813, 1.4835924457429048], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv", 10, 0, 0.0, 14.4, 8, 25, 13.0, 24.6, 25.0, 25.0, 2.366863905325444, 17.199056952662723, 1.1325813609467457], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 10, 0, 0.0, 16.6, 11, 25, 15.5, 24.6, 25.0, 25.0, 2.375296912114014, 0.5915046021377672, 1.1992465855106889], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities", 10, 0, 0.0, 6.000000000000001, 2, 15, 3.0, 14.9, 15.0, 15.0, 2.3736055067647754, 0.586447454308094, 1.0361344350818893], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 10, 0, 0.0, 2393.1000000000004, 2235, 2660, 2356.0, 2647.9, 2660.0, 2660.0, 0.20313642642398635, 0.6391655917364102, 0.10732110028845372], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 10, 0, 0.0, 7.000000000000001, 4, 24, 5.5, 22.300000000000004, 24.0, 24.0, 0.21297440047706268, 0.056571325126719765, 0.08340110799931848], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1", 10, 0, 0.0, 15.399999999999999, 8, 26, 14.5, 25.9, 26.0, 26.0, 3.301419610432486, 131.73438015846816, 1.2090159706173655], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice", 10, 0, 0.0, 22.5, 14, 41, 20.5, 39.800000000000004, 41.0, 41.0, 3.288391976323578, 132.5247657020717, 2.620437356132851], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0", 10, 0, 0.0, 6.6, 3, 16, 5.5, 15.400000000000002, 16.0, 16.0, 3.316749585406302, 1.3215174129353233, 1.4284048507462686], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice", 10, 0, 0.0, 12.6, 10, 26, 11.0, 24.700000000000003, 26.0, 26.0, 0.21292905203986032, 8.562908557618602, 0.18111445735031087], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO", 10, 0, 0.0, 7.0, 2, 15, 3.5, 14.9, 15.0, 15.0, 3.3400133600534403, 0.8252181446225785, 1.200317301269205], "isController": false}, {"data": ["Manage Invoice", 10, 6, 60.0, 8448.4, 6469, 10200, 8653.0, 10190.6, 10200.0, 10200.0, 0.8700191404210892, 56.643853586653904, 15.552441763093789], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount", 10, 0, 0.0, 9.4, 6, 14, 9.5, 13.700000000000001, 14.0, 14.0, 2.378121284185493, 0.6340108501783591, 1.161192033293698], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 20, 0, 0.0, 5.249999999999999, 2, 17, 3.0, 15.50000000000001, 16.95, 17.0, 0.23357937027001774, 0.0577105280061665, 0.10355960361580865], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData", 10, 0, 0.0, 3.3000000000000003, 2, 8, 3.0, 7.600000000000001, 8.0, 8.0, 1.9924287706714485, 0.4922699990037856, 0.9183851364813708], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 30, 0, 0.0, 4.266666666666665, 2, 17, 3.0, 7.900000000000002, 17.0, 17.0, 0.3504304453970961, 0.09068756643577194, 0.14407345460173582], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 10, 0, 0.0, 3.0, 2, 8, 2.0, 7.600000000000001, 8.0, 8.0, 0.21299708193997743, 0.05262525559649833, 0.07404976676819527], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice", 10, 0, 0.0, 11.900000000000002, 8, 29, 9.0, 27.500000000000007, 29.0, 29.0, 1.9896538002387585, 0.49158438619180267, 5.842665016912058], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0", 10, 0, 0.0, 4.199999999999999, 3, 6, 4.0, 6.0, 6.0, 6.0, 0.21296079391783973, 0.08485156632663926, 0.09233846923781332], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1", 10, 0, 0.0, 8.200000000000001, 6, 20, 7.0, 18.800000000000004, 20.0, 20.0, 0.2129517238442045, 8.478972348218658, 0.08879920515769074], "isController": false}, {"data": ["Add invoice", 10, 1, 10.0, 397.49999999999994, 44, 3153, 104.5, 2851.700000000001, 3153.0, 3153.0, 3.171582619727244, 137.58907687123374, 13.184987511893434], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode", 10, 0, 0.0, 12.5, 4, 19, 14.5, 18.8, 19.0, 19.0, 3.334444814938313, 2.592009836612204, 1.4588196065355117], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice", 20, 0, 0.0, 65.75, 13, 679, 23.0, 198.40000000000038, 655.8499999999997, 679.0, 5.145356315924878, 11.072063127090301, 2.4495714882943145], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice", 10, 0, 0.0, 14.6, 10, 23, 15.0, 22.5, 23.0, 23.0, 2.6034886748242645, 0.7703682309294454, 1.2508949492319708], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 20, 0, 0.0, 4.4, 2, 16, 3.0, 12.50000000000001, 15.849999999999998, 16.0, 0.22764264657340905, 0.05624373982721923, 0.10114980878017688], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 10, 0, 0.0, 16.7, 8, 34, 12.5, 33.7, 34.0, 34.0, 1.5787811809283234, 0.5442478094411115, 0.7940159259551627], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,047 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}, {"data": ["The operation lasted too long: It took 3,069 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}, {"data": ["The operation lasted too long: It took 3,403 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}, {"data": ["The operation lasted too long: It took 4,711 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}, {"data": ["The operation lasted too long: It took 4,620 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}, {"data": ["The operation lasted too long: It took 5,009 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}, {"data": ["The operation lasted too long: It took 4,510 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 14.285714285714286, 0.2631578947368421], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 380, 7, "The operation lasted too long: It took 3,047 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,069 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,403 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,711 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,620 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 10, 6, "The operation lasted too long: It took 3,047 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,403 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,711 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,620 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,009 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 30, 1, "The operation lasted too long: It took 3,069 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
