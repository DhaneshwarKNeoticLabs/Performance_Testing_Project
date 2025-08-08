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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7918918918918919, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1"], "isController": false}, {"data": [0.8, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180, 25, 13.88888888888889, 127.82222222222227, 2, 1122, 7.0, 510.0000000000005, 858.2999999999989, 1077.4499999999998, 1.3937174315336311, 13.330712148473491, 15.960945484839451], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0", 10, 0, 0.0, 22.900000000000002, 6, 108, 7.0, 100.20000000000003, 108.0, 108.0, 0.07791499474073786, 0.03104425571701274, 0.03241385523393977], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2", 5, 0, 0.0, 199.8, 142, 245, 205.0, 245.0, 245.0, 245.0, 0.7426110203475419, 1.143649979578197, 0.3009605209416308], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail", 10, 0, 0.0, 10.599999999999998, 2, 51, 3.0, 49.00000000000001, 51.0, 51.0, 0.07800616248683645, 0.01927300694254846, 0.03488947501852647], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 5, 5, 100.0, 404.0, 363, 519, 386.0, 519.0, 519.0, 519.0, 0.7287567409998542, 32.91717338033814, 0.330217898265559], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 10, 5, 50.0, 116.3, 11, 243, 120.5, 242.8, 243.0, 243.0, 1.1411617026132603, 23.10462402288029, 1.2921650333789798], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill", 5, 0, 0.0, 156.8, 131, 229, 137.0, 229.0, 229.0, 229.0, 0.737354372511429, 0.21458164356289633, 1.7245739474266333], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1", 10, 0, 0.0, 22.7, 7, 71, 8.0, 69.9, 71.0, 71.0, 0.0779775736498183, 3.108137349698227, 0.030536139681227682], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC", 5, 0, 0.0, 171.4, 145, 245, 152.0, 245.0, 245.0, 245.0, 0.7300335815447511, 0.27019797598189516, 0.42989282194480943], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc", 5, 0, 0.0, 2.6, 2, 3, 3.0, 3.0, 3.0, 3.0, 0.7522190461862495, 0.18585099480968859, 0.3437876109523093], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName", 5, 0, 0.0, 2.8, 2, 3, 3.0, 3.0, 3.0, 3.0, 0.771962328238382, 0.1907289736760846, 0.3075787401574803], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 15, 0, 0.0, 6.2666666666666675, 2, 45, 3.0, 22.80000000000001, 45.0, 45.0, 0.11700194223224106, 0.028907706430426745, 0.0518739079818725], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 10, 0, 0.0, 983.2, 769, 1122, 1012.0, 1116.5, 1122.0, 1122.0, 0.07754342431761786, 0.019385856079404466, 15.231376250387717], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 5, 5, 100.0, 43.2, 41, 50, 41.0, 50.0, 50.0, 50.0, 0.743052459503641, 33.56289590763858, 0.39474661911130926], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC", 5, 0, 0.0, 3.4, 3, 4, 3.0, 4.0, 4.0, 4.0, 0.7718431614695893, 0.1906995311052794, 0.3813990622105588], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 10, 0, 0.0, 4.7, 2, 15, 3.5, 14.000000000000004, 15.0, 15.0, 0.078003120124805, 0.020186354329173168, 0.03191729231669267], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0", 5, 0, 0.0, 18.2, 4, 73, 4.0, 73.0, 73.0, 73.0, 0.7717240314863404, 0.3074837937953388, 0.34215108427226426], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1", 5, 0, 0.0, 6.6, 6, 7, 7.0, 7.0, 7.0, 7.0, 0.7716049382716049, 30.722535686728392, 0.321753231095679], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable", 5, 0, 0.0, 487.0, 415, 612, 429.0, 612.0, 612.0, 612.0, 0.6941552131056504, 2.71900054664723, 0.31047176523670694], "isController": false}, {"data": ["Test", 5, 5, 100.0, 4485.6, 4125, 4697, 4521.0, 4697.0, 4697.0, 4697.0, 0.9104151493080845, 203.5729171408412, 373.08706129369995], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 10, 0, 0.0, 5.8, 2, 32, 3.0, 29.20000000000001, 32.0, 32.0, 0.07800433704113949, 0.019272555929109658, 0.03466013022824069], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC", 5, 0, 0.0, 627.8, 548, 720, 602.0, 720.0, 720.0, 720.0, 0.6901311249137336, 0.9772364561766735, 0.4528985507246377], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC", 5, 0, 0.0, 3.6, 3, 4, 4.0, 4.0, 4.0, 4.0, 0.7480550568521843, 0.18482219666367444, 0.44269664497307], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 10, 10, 100.0, 46.3, 13, 136, 15.5, 132.60000000000002, 136.0, 136.0, 0.07791074545001246, 3.13651618206183, 0.06292205711636749], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 20, 0, 0.0, 7.649999999999999, 2, 35, 3.0, 30.20000000000004, 34.849999999999994, 35.0, 0.15635994058322256, 0.03863189938237824, 0.06947634078649051], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 5, 20.0, 2.7777777777777777], "isController": false}, {"data": ["500/Internal Server Error", 10, 40.0, 5.555555555555555], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 10, 40.0, 5.555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180, 25, "500/Internal Server Error", 10, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 10, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 5, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 10, 5, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 5, 5, "500/Internal Server Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 10, 10, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 5, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
