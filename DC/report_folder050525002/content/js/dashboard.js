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

    var data = {"OkPercent": 79.44444444444444, "KoPercent": 20.555555555555557};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6940540540540541, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0"], "isController": false}, {"data": [0.6, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2"], "isController": false}, {"data": [0.995, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo"], "isController": false}, {"data": [0.14, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan"], "isController": false}, {"data": [0.71, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill"], "isController": false}, {"data": [0.995, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1"], "isController": false}, {"data": [0.25, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.265, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1"], "isController": false}, {"data": [0.23, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.16, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 370, 20.555555555555557, 1008.9238888888908, 1, 19195, 25.0, 2144.6000000000004, 6145.849999999999, 15061.96, 9.314456035767511, 98.12839569329307, 106.66977512380465], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0", 100, 0, 0.0, 156.64000000000001, 4, 3233, 45.5, 189.90000000000006, 247.44999999999987, 3232.1499999999996, 0.519945093798095, 0.20716562331017843, 0.21630528316209807], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2", 50, 4, 8.0, 1363.8600000000001, 99, 15037, 687.0, 2921.9999999999995, 8600.79999999995, 15037.0, 1.5478917714073432, 5.085126791684726, 0.6273194190762182], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail", 100, 0, 0.0, 45.33000000000001, 1, 507, 8.0, 110.9, 152.84999999999997, 503.95999999999844, 0.5205594973477493, 0.12861479768455136, 0.23282836893092695], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 50, 50, 100.0, 1910.8400000000001, 384, 5500, 1381.0, 4219.299999999999, 4461.099999999999, 5500.0, 2.826455624646693, 127.6680195378745, 1.2807377049180326], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 100, 51, 51.0, 852.1099999999999, 9, 4351, 153.5, 2767.9, 2783.0, 4336.499999999993, 1.8767359807822235, 37.99748898590571, 2.1250736032392465], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill", 50, 0, 0.0, 694.26, 152, 2406, 343.0, 2050.5999999999995, 2142.8, 2406.0, 0.9645247786415633, 0.28069178128436123, 2.2558953562954533], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1", 100, 0, 0.0, 86.37, 6, 513, 28.0, 227.70000000000007, 297.7499999999997, 512.1399999999995, 0.5203346792657036, 20.74021510635641, 0.20376387342338592], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC", 50, 27, 54.0, 8195.980000000001, 109, 17422, 3660.0, 17261.1, 17382.55, 17422.0, 0.9783969943644333, 10.004950077293362, 0.5761458863298372], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc", 50, 0, 0.0, 4.000000000000001, 2, 25, 3.0, 7.899999999999999, 13.449999999999996, 25.0, 0.9826078412105729, 0.24277322639284662, 0.44908248992826966], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName", 50, 0, 0.0, 6.460000000000001, 1, 82, 2.0, 13.799999999999997, 36.79999999999998, 82.0, 3.3249102274238598, 0.821486608924059, 1.324768918739194], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 150, 0, 0.0, 32.13333333333332, 1, 478, 3.0, 102.10000000000005, 127.44999999999999, 310.720000000003, 0.7806970062872133, 0.19288705331119624, 0.3461293367718699], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 100, 46, 46.0, 3428.9400000000014, 682, 8135, 1131.0, 7286.900000000001, 7696.0999999999985, 8134.58, 0.5181696176426391, 0.12954240441065978, 101.78085991543472], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 50, 50, 100.0, 2149.8400000000006, 30, 15044, 37.0, 14644.7, 14792.849999999999, 15044.0, 0.9809499519334522, 44.30847473318162, 0.5211296619646466], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC", 50, 0, 0.0, 7.179999999999999, 2, 118, 2.0, 4.899999999999999, 54.34999999999956, 118.0, 3.3375609104866166, 0.8246122171417128, 1.6492244342834257], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 100, 0, 0.0, 41.14, 1, 345, 8.5, 102.70000000000002, 168.2499999999996, 344.4499999999997, 0.5205080158234437, 0.13470178143868416, 0.21298130725588174], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0", 50, 0, 0.0, 7.54, 2, 97, 4.0, 13.0, 28.499999999999957, 97.0, 3.2814858567959573, 1.3074670210671393, 1.454877518540395], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1", 50, 0, 0.0, 9.200000000000001, 6, 79, 7.0, 14.699999999999996, 20.14999999999997, 79.0, 3.301201637396012, 131.4419855077248, 1.3765752921563448], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable", 50, 15, 30.0, 4205.12, 407, 19195, 1928.5, 15043.6, 16858.399999999983, 19195.0, 0.9758763369505816, 8.653316576723398, 0.4364759397689125], "isController": false}, {"data": ["Test", 50, 50, 100.0, 35818.5, 5278, 53089, 47595.5, 51973.6, 52349.7, 53089.0, 0.9142606374225164, 236.36549897488527, 374.66293781656276], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 100, 0, 0.0, 37.26999999999999, 1, 318, 7.0, 95.0, 105.0, 316.36999999999915, 0.5205188531928627, 0.1286047557205022, 0.23128523261987546], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC", 50, 27, 54.0, 7832.560000000001, 508, 19024, 5236.5, 15049.0, 15060.7, 19024.0, 0.9724599346506924, 19.247166342918547, 0.6381768321145169], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC", 50, 0, 0.0, 8.300000000000002, 2, 37, 3.0, 28.0, 32.449999999999996, 37.0, 0.9810654370646522, 0.24239214411851268, 0.5805914598253703], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 100, 100, 100.0, 243.29999999999993, 11, 3353, 109.5, 383.9000000000001, 545.2499999999984, 3352.1399999999994, 0.5199126546740147, 20.930546168243733, 0.41989039591348654], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 200, 0, 0.0, 11.879999999999999, 1, 196, 3.0, 38.0, 57.94999999999999, 120.7800000000002, 1.0422963874007214, 0.25752049415271727, 0.4631297424485627], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 7,499 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,855 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,535 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,362 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,132 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,716 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,097 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,422 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 16,550 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,712 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,862 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,969 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 8,043 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 19,024 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 16,498 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,925 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,860 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,169 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,292 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,283 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,328 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,031 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,874 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,365 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,546 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,146 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 16,411 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,226 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,284 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,267 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,983 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,074 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,945 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,727 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,689 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,491 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,141 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,670 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,001 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,235 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,149 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,279 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,103 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 19,054 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,095 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,423 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["500/Internal Server Error", 140, 37.83783783783784, 7.777777777777778], "isController": false}, {"data": ["The operation lasted too long: It took 7,704 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,796 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,549 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,022 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,265 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,298 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,630 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,354 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,822 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,665 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,332 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,962 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,149 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,732 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,427 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 17,404 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 5,933 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 16,338 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,187 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,028 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,181 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 8,135 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,400 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 100, 27.027027027027028, 5.555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,497 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 47, 12.702702702702704, 2.611111111111111], "isController": false}, {"data": ["The operation lasted too long: It took 3,343 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 8,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,443 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,588 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,143 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,053 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,351 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,518 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 19,195 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 3,353 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 6,028 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 7,845 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2702702702702703, 0.05555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 370, "500/Internal Server Error", 140, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 100, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 47, "The operation lasted too long: It took 7,499 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,855 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2", 50, 4, "500/Internal Server Error", 2, "The operation lasted too long: It took 3,343 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,279 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 50, 50, "500/Internal Server Error", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 100, 51, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 50, "The operation lasted too long: It took 4,351 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC", 50, 27, "500/Internal Server Error", 11, "The operation lasted too long: It took 17,265 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 17,362 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,132 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 16,411 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 100, 46, "The operation lasted too long: It took 7,499 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,855 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,535 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,716 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 7,097 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 50, 50, "500/Internal Server Error", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable", 50, 15, "500/Internal Server Error", 6, "The operation lasted too long: It took 4,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 19,054 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,427 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,031 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC", 50, 27, "500/Internal Server Error", 21, "The operation lasted too long: It took 6,292 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,727 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,549 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,518 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 100, 100, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 50, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 47, "The operation lasted too long: It took 3,235 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,267 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,353 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
