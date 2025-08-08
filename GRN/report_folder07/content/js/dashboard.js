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

    var data = {"OkPercent": 77.10526315789474, "KoPercent": 22.894736842105264};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.72875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC"], "isController": false}, {"data": [0.3, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1"], "isController": false}, {"data": [0.8, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems"], "isController": false}, {"data": [0.75, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList"], "isController": false}, {"data": [0.0, 500, 1500, "Add New GRN Scenario"], "isController": true}, {"data": [0.0, 500, 1500, "openGRN Scenario"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1"], "isController": false}, {"data": [0.4, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.3, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu"], "isController": false}, {"data": [0.4, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata"], "isController": false}, {"data": [0.4, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN"], "isController": false}, {"data": [0.45, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 380, 87, 22.894736842105264, 3337.41842105263, 2, 30030, 7.0, 28149.70000000001, 30014.95, 30017.0, 1.1167930406159996, 10.335912128776524, 0.5977735775583377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 10, 10, 100.0, 3121.7000000000003, 35, 30009, 41.0, 27055.30000000001, 30009.0, 30009.0, 0.0515479860201862, 2.114373543769395, 0.030304577718898523], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 10, 7, 70.0, 21018.5, 27, 30017, 30014.0, 30016.8, 30017.0, 30017.0, 0.0586606598151016, 0.16126525727098878, 0.028413757097939835], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 10, 0, 0.0, 7.9, 4, 19, 6.5, 18.1, 19.0, 19.0, 0.05156659309832718, 0.029257998623171962, 0.022560384480518142], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0", 20, 0, 0.0, 4.55, 2, 12, 4.0, 7.800000000000004, 11.799999999999997, 12.0, 0.058800700904354776, 0.023428404266578856, 0.024519432896640127], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1", 20, 0, 0.0, 9.900000000000002, 7, 39, 7.0, 17.700000000000006, 37.94999999999999, 39.0, 0.05880018228056507, 2.3437385155893984, 0.023026243256354096], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 10, 1, 10.0, 3341.5, 16, 30012, 56.0, 27307.10000000001, 30012.0, 30012.0, 0.0516552938927946, 0.03395427570238286, 0.02804721035585332], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 10, 2, 20.0, 485.8999999999999, 354, 1100, 424.0, 1038.2000000000003, 1100.0, 1100.0, 0.05144668066016381, 0.4748870263046878, 0.03893669678869819], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 20, 20, 100.0, 14.750000000000002, 9, 44, 12.0, 24.50000000000001, 43.04999999999998, 44.0, 0.058799317927912036, 2.3671319162697713, 0.04754476098077263], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 10, 0, 0.0, 14.299999999999999, 6, 31, 11.5, 30.1, 31.0, 31.0, 0.051563934121917766, 0.0126895619128157, 0.03504736147349098], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin", 10, 0, 0.0, 3.6, 2, 8, 3.0, 7.800000000000001, 8.0, 8.0, 0.09021281202356358, 0.022288907658165612, 0.04484211066405651], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 10, 10, 100.0, 19621.1, 375, 30015, 30005.5, 30014.3, 30015.0, 30015.0, 0.07099600292503531, 1.143701234620491, 0.03459668501913342], "isController": false}, {"data": ["Add New GRN Scenario", 10, 10, 100.0, 126730.20000000001, 1144, 187162, 178134.0, 186904.0, 187162.0, 187162.0, 0.052526801800618764, 9.934659736302324, 0.7719490627905389], "isController": true}, {"data": ["openGRN Scenario", 10, 10, 100.0, 49.9, 30, 158, 34.5, 148.70000000000005, 158.0, 158.0, 2.2177866489243736, 92.75719394544244, 7.032376219782656], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1", 10, 0, 0.0, 6.9, 6, 11, 6.5, 10.600000000000001, 11.0, 11.0, 0.4798464491362764, 19.105761156429942, 0.2000922204894434], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 10, 6, 60.0, 18015.3, 10, 30030, 30014.5, 30028.5, 30030.0, 30030.0, 0.12368124868588674, 0.35420666982053856, 0.05640541321905186], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0", 10, 0, 0.0, 6.0, 4, 19, 5.0, 17.600000000000005, 19.0, 19.0, 0.480007680122882, 0.1912530600489608, 0.21047211755388087], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 30, 0, 0.0, 3.0666666666666673, 2, 10, 3.0, 4.900000000000002, 7.799999999999997, 10.0, 0.08821168451973148, 0.02179448846044147, 0.039109477316365326], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 10, 7, 70.0, 19543.0, 11, 30018, 27030.0, 30017.7, 30018.0, 30018.0, 0.05166596917608279, 0.9958565103641934, 0.021897490842206966], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 20, 0, 0.0, 4.5, 2, 18, 3.0, 14.300000000000015, 17.849999999999998, 18.0, 0.0588083084378161, 0.015218947007833265, 0.0240631652689892], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 20, 0, 0.0, 2.7000000000000006, 2, 7, 2.0, 3.900000000000002, 6.849999999999998, 7.0, 0.058808827204963464, 0.014529915315288825, 0.02044525633297558], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 10, 1, 10.0, 3258.0, 99, 30017, 333.0, 27061.60000000001, 30017.0, 30017.0, 0.05155755369719218, 0.1367533902313903, 0.028245886351684384], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 20, 0, 0.0, 10.349999999999996, 3, 82, 6.5, 14.50000000000001, 78.64999999999995, 82.0, 4.580852038479157, 1.198894869445717, 1.7603176534585434], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 10, 6, 60.0, 18009.199999999997, 7, 30015, 30006.5, 30014.9, 30015.0, 30015.0, 0.1966761726816796, 0.4760562125086046, 0.08911889074638608], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata", 10, 0, 0.0, 4.8999999999999995, 2, 24, 3.0, 21.900000000000006, 24.0, 24.0, 0.051560212015591814, 0.012738997695258523, 0.025226236542784664], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 10, 6, 60.0, 18013.9, 10, 30016, 30015.0, 30015.9, 30016.0, 30016.0, 0.09020548810189612, 0.3268363300348193, 0.040169631420375614], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 20, 11, 55.0, 1112.2, 10, 21538, 32.5, 113.00000000000003, 20466.799999999985, 21538.0, 0.10274271682566102, 2.313010462740354, 0.16063582972449542], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 50, 0, 0.0, 4.62, 2, 39, 3.0, 10.0, 23.499999999999957, 39.0, 0.14702293263703273, 0.03632500191129812, 0.06532757260727527], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 10, 11.494252873563218, 2.6315789473684212], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 20, 22.988505747126435, 5.2631578947368425], "isController": false}, {"data": ["500/Internal Server Error", 57, 65.51724137931035, 15.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 380, 87, "500/Internal Server Error", 57, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 20, "The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 10, 7, "500/Internal Server Error", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 10, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 10, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 20, 20, "The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 10, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 10, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 10, 6, "500/Internal Server Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 10, 7, "500/Internal Server Error", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 10, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 10, 6, "500/Internal Server Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 10, 6, "500/Internal Server Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 20, 11, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 10, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
