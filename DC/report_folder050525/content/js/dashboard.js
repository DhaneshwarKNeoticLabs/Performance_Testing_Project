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

    var data = {"OkPercent": 86.11111111111111, "KoPercent": 13.88888888888889};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7837837837837838, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9666666666666667, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 540, 75, 13.88888888888889, 167.4851851851851, 1, 3064, 14.0, 666.9000000000003, 997.7499999999997, 1406.630000000005, 4.008997973228802, 38.34550445861823, 45.91131362196263], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0", 30, 0, 0.0, 128.16666666666669, 5, 3058, 10.0, 136.30000000000007, 1459.699999999998, 3058.0, 0.22442323229300698, 0.08941863161674497, 0.09336357124689548], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2", 15, 0, 0.0, 165.73333333333332, 44, 355, 142.0, 291.40000000000003, 355.0, 355.0, 1.6624182644353318, 2.5601890654438657, 0.673733964590491], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail", 30, 0, 0.0, 18.499999999999996, 1, 74, 4.5, 71.0, 72.9, 74.0, 0.22470731871737062, 0.05551850745653786, 0.10050385934819897], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 15, 15, 100.0, 532.6666666666666, 372, 800, 516.0, 758.0, 800.0, 800.0, 1.618996222342148, 73.12835182811656, 0.7336076632487857], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 30, 15, 50.0, 136.4333333333333, 10, 403, 85.0, 330.6, 398.6, 403.0, 2.62582056892779, 53.16389154814004, 2.97328022428884], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill", 15, 0, 0.0, 281.46666666666664, 154, 1037, 159.0, 882.2, 1037.0, 1037.0, 1.603592046183451, 0.4666703415651059, 3.7505888189544585], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1", 30, 0, 0.0, 24.09999999999999, 6, 73, 12.5, 57.800000000000004, 67.5, 73.0, 0.22458788123792842, 8.951932578718052, 0.08794896521133719], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC", 15, 0, 0.0, 218.20000000000002, 101, 357, 200.0, 342.0, 357.0, 357.0, 1.6101331043366252, 0.5959379360777157, 0.9481545526513524], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc", 15, 0, 0.0, 4.4, 2, 14, 3.0, 11.000000000000002, 14.0, 14.0, 1.652164335279216, 0.40820075861879057, 0.755090731358079], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName", 15, 0, 0.0, 2.400000000000001, 2, 4, 2.0, 3.4000000000000004, 4.0, 4.0, 1.6874789065136686, 0.4169259407694904, 0.6723548768140398], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 45, 0, 0.0, 11.599999999999998, 2, 66, 3.0, 38.8, 42.39999999999999, 66.0, 0.336965067954622, 0.0832540646411322, 0.14939662192519376], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 30, 0, 0.0, 1069.8000000000002, 814, 1788, 1015.0, 1452.9000000000003, 1613.6499999999999, 1788.0, 0.22307818146666467, 0.05576954536666617, 43.817870374845704], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 15, 15, 100.0, 43.13333333333333, 33, 84, 39.0, 70.2, 84.0, 84.0, 1.628841350852427, 73.5730458993919, 0.8653219676403519], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC", 15, 0, 0.0, 3.3333333333333335, 2, 11, 3.0, 7.400000000000002, 11.0, 11.0, 1.6874789065136686, 0.4169259407694904, 0.8338518815389808], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 30, 0, 0.0, 25.16666666666668, 2, 157, 3.0, 70.40000000000006, 156.45, 157.0, 0.22467029634012087, 0.05814221536145706, 0.09193052164698305], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0", 15, 0, 0.0, 7.333333333333334, 3, 23, 4.0, 21.8, 23.0, 23.0, 1.686909581646424, 0.6721280364372471, 0.7479071778002699], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1", 15, 0, 0.0, 7.733333333333335, 6, 12, 7.0, 12.0, 12.0, 12.0, 1.6865302451090622, 67.1515733921745, 0.7032699361929391], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable", 15, 0, 0.0, 715.0, 406, 1067, 767.0, 1055.6, 1067.0, 1067.0, 1.5082956259426847, 5.907982183257919, 0.6746087858220211], "isController": false}, {"data": ["Test", 15, 15, 100.0, 5709.866666666666, 4947, 8104, 5638.0, 6946.6, 8104.0, 8104.0, 1.8195050946142648, 406.84951271379185, 745.631055540393], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 30, 0, 0.0, 16.566666666666666, 2, 70, 4.0, 41.60000000000001, 58.44999999999999, 70.0, 0.22469048885160692, 0.05551434929634429, 0.09983805901121205], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC", 15, 0, 0.0, 817.6000000000001, 546, 1314, 699.0, 1253.4, 1314.0, 1314.0, 1.526562181966212, 2.1616359021982494, 1.0018064319153266], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC", 15, 0, 0.0, 6.066666666666666, 3, 32, 4.0, 18.20000000000001, 32.0, 32.0, 1.6354121238552115, 0.40406178450719576, 0.967831784234627], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 30, 30, 100.0, 152.66666666666666, 13, 3064, 26.0, 157.50000000000009, 1502.549999999998, 3064.0, 0.2244114808913624, 9.034315320571801, 0.18123856904019212], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 60, 0, 0.0, 11.700000000000001, 2, 149, 3.0, 46.699999999999996, 55.74999999999998, 149.0, 0.44926657232068645, 0.11100043241907587, 0.1996252835995238], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 14, 18.666666666666668, 2.5925925925925926], "isController": false}, {"data": ["The operation lasted too long: It took 3,064 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.3333333333333333, 0.18518518518518517], "isController": false}, {"data": ["500/Internal Server Error", 30, 40.0, 5.555555555555555], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 30, 40.0, 5.555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 540, 75, "500/Internal Server Error", 30, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 30, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 14, "The operation lasted too long: It took 3,064 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 15, 15, "500/Internal Server Error", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 30, 15, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 15, 15, "500/Internal Server Error", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 30, 30, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 15, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 14, "The operation lasted too long: It took 3,064 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
