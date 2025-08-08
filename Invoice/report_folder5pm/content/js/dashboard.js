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

    var data = {"OkPercent": 94.10526315789474, "KoPercent": 5.894736842105263};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.84975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid"], "isController": false}, {"data": [0.98, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice"], "isController": false}, {"data": [0.34, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice"], "isController": false}, {"data": [0.08, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv"], "isController": false}, {"data": [0.96, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty"], "isController": false}, {"data": [0.88, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype"], "isController": false}, {"data": [0.74, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv"], "isController": false}, {"data": [0.95, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList"], "isController": false}, {"data": [0.98, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList"], "isController": false}, {"data": [0.75, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1"], "isController": false}, {"data": [0.98, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice"], "isController": false}, {"data": [0.98, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO"], "isController": false}, {"data": [0.0, 500, 1500, "Manage Invoice"], "isController": true}, {"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount"], "isController": false}, {"data": [0.995, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [0.98, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1"], "isController": false}, {"data": [0.64, 500, 1500, "Add invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode"], "isController": false}, {"data": [0.975, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice"], "isController": false}, {"data": [0.99, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice"], "isController": false}, {"data": [0.995, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}, {"data": [0.93, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1900, 112, 5.894736842105263, 926.6026315789479, 1, 32837, 12.0, 1242.0000000000018, 3832.8999999999996, 24214.94, 7.786278937295867, 41.86491209444756, 4.859708990385994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 50, 12, 24.0, 4529.419999999999, 706, 23245, 1828.5, 22512.8, 23116.35, 23245.0, 0.3115827781966835, 0.0973696181864636, 0.22851432268135674], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice", 50, 0, 0.0, 86.34, 37, 782, 46.0, 149.49999999999994, 410.9499999999981, 782.0, 0.3157243347688266, 0.09188071461045931, 1.1182931271548184], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 50, 6, 12.0, 1723.36, 416, 7004, 991.5, 4288.599999999999, 6132.849999999998, 7004.0, 0.3111387678904792, 0.20266558416303673, 0.15161938005600498], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 50, 31, 62.0, 4344.96, 923, 24215, 3458.0, 8015.199999999999, 11053.449999999999, 24215.0, 0.31003329757615966, 1.365175916768461, 0.15168621297427345], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty", 50, 1, 2.0, 700.54, 9, 30006, 37.0, 291.9, 827.0499999999989, 30006.0, 0.315784155214228, 0.12130552274909054, 0.20939203260787184], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 150, 13, 8.666666666666666, 2215.506666666666, 3, 30384, 10.0, 2262.5000000000023, 28268.049999999996, 30204.480000000003, 0.6205681094185691, 2.006148019974019, 0.2597820926797786], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid", 50, 0, 0.0, 511.28, 35, 1594, 447.5, 968.5999999999999, 1340.899999999998, 1594.0, 0.3154096540586914, 0.07854439627438116, 0.14384405121621963], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 50, 0, 0.0, 12.579999999999998, 2, 230, 3.0, 15.899999999999999, 64.89999999999957, 230.0, 0.3127443315089914, 0.0772698397185301, 0.1389635457388585], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv", 50, 0, 0.0, 89.60000000000004, 7, 915, 13.0, 245.5999999999999, 663.4499999999989, 915.0, 0.31218001548412877, 2.2684877882982444, 0.14938301522189756], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 50, 2, 4.0, 780.86, 8, 18779, 29.5, 140.79999999999998, 8221.949999999928, 18779.0, 0.31218196462353975, 0.35820441518952567, 0.15761530831090825], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities", 50, 0, 0.0, 47.6, 2, 644, 3.5, 125.6, 390.09999999999854, 644.0, 0.3121956092809511, 0.07713426674617248, 0.13628070053572766], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 50, 34, 68.0, 10698.099999999999, 2245, 32837, 6067.0, 28737.799999999992, 32402.35, 32837.0, 0.2513724938162366, 0.7909396240975728, 0.13280519448689848], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 50, 9, 18.0, 2268.2400000000007, 3, 28796, 9.5, 13129.999999999987, 17134.1, 28796.0, 0.2543079771326267, 0.7527069097384697, 0.09958740120135089], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1", 50, 0, 0.0, 22.660000000000007, 6, 401, 10.0, 38.699999999999996, 51.449999999999996, 401.0, 0.3126504630353357, 12.470649937782557, 0.11735383981666177], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice", 50, 0, 0.0, 53.900000000000006, 9, 580, 18.5, 71.39999999999999, 482.1499999999994, 580.0, 0.31262700472066773, 12.594276581111076, 0.25483985681683186], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0", 50, 0, 0.0, 30.859999999999996, 2, 566, 5.0, 19.0, 292.99999999999807, 566.0, 0.3126406883097394, 0.12456777424841178, 0.13750084022184983], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice", 50, 0, 0.0, 18.68, 9, 180, 12.0, 22.599999999999994, 69.64999999999975, 180.0, 0.2542950432810164, 10.22643543194556, 0.21629978779078637], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO", 50, 0, 0.0, 29.42, 2, 393, 3.0, 135.0, 186.99999999999974, 393.0, 0.3127541127165822, 0.0772722563645462, 0.11239600925752173], "isController": false}, {"data": ["Manage Invoice", 50, 49, 98.0, 28293.5, 5729, 76079, 29553.5, 42315.2, 54451.149999999965, 76079.0, 0.30197795560924057, 21.84412983164729, 5.39815085686245], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount", 50, 0, 0.0, 119.74000000000005, 5, 1295, 12.5, 347.89999999999986, 932.2499999999998, 1295.0, 0.3121741682119288, 0.08322612101743805, 0.15242879307223087], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 100, 0, 0.0, 21.84999999999999, 1, 592, 3.0, 19.900000000000006, 55.84999999999974, 590.039999999999, 0.41815110308260994, 0.10331272371084015, 0.1853912117182665], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData", 50, 0, 0.0, 19.419999999999998, 2, 192, 3.0, 92.49999999999997, 132.89999999999998, 192.0, 0.31581806352996167, 0.07802926764949249, 0.1455723886583417], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 150, 0, 0.0, 14.126666666666665, 2, 402, 3.0, 10.900000000000006, 37.24999999999994, 401.49, 0.6272738677706687, 0.16233161617112032, 0.2578928694643081], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 50, 0, 0.0, 4.320000000000001, 2, 22, 2.0, 10.899999999999999, 17.349999999999987, 22.0, 0.2543118575446699, 0.06283291011601706, 0.08841310672451413], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice", 50, 0, 0.0, 55.17999999999999, 7, 739, 9.0, 177.49999999999997, 375.29999999999865, 739.0, 0.31579811658003276, 0.07802433935034012, 0.9273485708556234], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0", 50, 0, 0.0, 10.120000000000003, 3, 164, 4.0, 10.799999999999997, 52.49999999999979, 164.0, 0.2543053902570519, 0.1013248039305441, 0.11026522780676859], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1", 50, 0, 0.0, 8.34, 6, 21, 7.0, 13.899999999999999, 16.349999999999987, 21.0, 0.2543015100423667, 10.125372233835325, 0.10604174295711968], "isController": false}, {"data": ["Add invoice", 50, 13, 26.0, 6845.419999999999, 32, 31589, 115.0, 30057.2, 30415.25, 31589.0, 0.3074085459575776, 15.825295880725484, 1.2835867852751306], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode", 50, 0, 0.0, 27.819999999999997, 3, 354, 11.0, 68.19999999999997, 125.24999999999989, 354.0, 0.312758025370931, 0.24312049628443466, 0.13683163609978233], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice", 100, 1, 1.0, 284.5399999999999, 13, 17512, 54.5, 210.30000000000004, 345.7499999999995, 17349.979999999916, 0.6253400286405734, 1.6212856267939442, 0.29770826558816355], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice", 50, 0, 0.0, 69.89999999999999, 11, 669, 20.5, 169.99999999999997, 214.84999999999977, 669.0, 0.313032154662927, 0.09262572545201843, 0.1504021680607032], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 100, 0, 0.0, 15.52, 2, 667, 3.0, 13.0, 42.29999999999984, 662.6199999999977, 0.41425535528610546, 0.1023502000853366, 0.18406854165544725], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 50, 3, 6.0, 1614.94, 6, 30781, 14.0, 302.3999999999999, 23041.399999999943, 30781.0, 0.312961618387121, 0.949581785477329, 0.157397688934929], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 5,314 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 14,580 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 11,087 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 22,466 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 22,846 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,173 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,888 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,028 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 14,633 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 14,819 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 32,311 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 11,857 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,055 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 17,900 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 16,210 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 24,215 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,353 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 14,024 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 23,206 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,405 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,587 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 8,116 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,256 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,312 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,712 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,021 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 32,837 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,359 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,445 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,447 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,531 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 16,190 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,469 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 9,580 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,084 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 7,108 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["500/Internal Server Error", 19, 16.964285714285715, 1.0], "isController": false}, {"data": ["The operation lasted too long: It took 32,514 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,417 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 19,278 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,227 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 7,016 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,392 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,121 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,225 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 19,704 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,115 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,598 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,831 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 22,518 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,853 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,488 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,102 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 29,241 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 24,209 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 23,245 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,857 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,820 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,473 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,445 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 23,043 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,456 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 18,277 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 31,268 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,019 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,022 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 11,026 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,470 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,943 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,411 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,729 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,418 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 7,104 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 13,223 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 14,028 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 22,945 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,142 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,833 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,030 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,842 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 18,779 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 7,004 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,233 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,871 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 21,670 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,274 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,379 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 6,850 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,699 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,691 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,971 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,337 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 5,830 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.8928571428571429, 0.05263157894736842], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1900, 112, "500/Internal Server Error", 19, "The operation lasted too long: It took 5,314 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,580 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 11,087 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 22,466 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 50, 12, "The operation lasted too long: It took 3,473 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 22,466 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,871 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 23,043 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 50, 6, "The operation lasted too long: It took 7,004 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,470 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,853 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,857 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,337 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 50, 31, "The operation lasted too long: It took 11,087 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,121 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,225 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,598 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,831 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty", 50, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 150, 13, "500/Internal Server Error", 10, "The operation lasted too long: It took 14,580 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,819 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 13,223 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 50, 2, "The operation lasted too long: It took 18,779 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 50, 34, "The operation lasted too long: It took 7,016 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 13,392 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,314 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 19,704 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,115 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 50, 9, "500/Internal Server Error", 3, "The operation lasted too long: It took 4,445 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,024 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,084 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,102 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice", 100, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 50, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
