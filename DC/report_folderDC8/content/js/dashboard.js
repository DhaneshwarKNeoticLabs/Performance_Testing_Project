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

    var data = {"OkPercent": 85.77777777777777, "KoPercent": 14.222222222222221};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0"], "isController": false}, {"data": [0.74, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2"], "isController": false}, {"data": [0.95, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo"], "isController": false}, {"data": [0.34, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan"], "isController": false}, {"data": [0.58, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1"], "isController": false}, {"data": [0.66, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC"], "isController": false}, {"data": [0.86, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc"], "isController": false}, {"data": [0.92, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.36, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC"], "isController": false}, {"data": [0.99, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.38, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC"], "isController": false}, {"data": [0.96, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 900, 128, 14.222222222222221, 389.95888888888857, 1, 4608, 131.5, 1062.6999999999998, 1309.499999999998, 2938.1100000000015, 5.634402409020052, 53.89227037266876, 64.52555421586335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0", 50, 0, 0.0, 302.70000000000005, 5, 4046, 16.0, 660.1999999999999, 2193.7999999999856, 4046.0, 0.3150459652063236, 0.12552612676189456, 0.13106404411903697], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2", 25, 0, 0.0, 534.8, 29, 1244, 553.0, 979.8000000000001, 1168.6999999999998, 1244.0, 1.9912385503783352, 3.0665851503385104, 0.8069960921943449], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail", 50, 0, 0.0, 140.92, 1, 1386, 10.0, 600.5999999999998, 1380.45, 1386.0, 0.31561870735202213, 0.07798001265631016, 0.14116539840549427], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 25, 25, 100.0, 796.04, 322, 1311, 759.0, 1258.8000000000002, 1301.1, 1311.0, 2.0948550360315066, 94.62239256012235, 0.9492311882017765], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 50, 25, 50.0, 547.28, 9, 1228, 506.5, 1027.0, 1124.0499999999997, 1228.0, 3.247807729782397, 65.75700562276714, 3.6775713502760636], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill", 25, 0, 0.0, 900.3200000000002, 155, 1947, 963.0, 1568.6000000000001, 1850.3999999999999, 1947.0, 1.6682236754304016, 0.48547915554517546, 3.9017536158748163], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1", 50, 0, 0.0, 105.71999999999994, 6, 366, 39.0, 362.9, 364.9, 366.0, 0.31537185495417647, 12.570525031064127, 0.12350011116857887], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC", 25, 0, 0.0, 652.76, 114, 1143, 589.0, 1132.4, 1140.9, 1143.0, 1.8100202722270489, 0.6699196124746597, 1.0658615470243267], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc", 25, 0, 0.0, 318.68, 2, 1016, 362.0, 693.8000000000003, 944.8999999999999, 1016.0, 1.8550122430808043, 0.45831845458930026, 0.8477985642205238], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName", 25, 0, 0.0, 178.35999999999999, 2, 749, 72.0, 570.2000000000003, 721.0999999999999, 749.0, 2.5378134199573648, 0.6270183547355598, 1.0111600345142624], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 75, 0, 0.0, 103.33333333333336, 2, 959, 20.0, 388.60000000000025, 669.6000000000006, 959.0, 0.47325479407106397, 0.11692720986326091, 0.2098219497151006], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 50, 3, 6.0, 1486.12, 768, 4608, 1091.5, 2921.1, 3172.149999999999, 4608.0, 0.3136782539413672, 0.07841956348534182, 61.613883438729225], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 25, 25, 100.0, 270.32000000000005, 33, 749, 160.0, 632.6000000000001, 722.9, 749.0, 1.8451546239574876, 83.34368830264226, 0.9802383939774153], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC", 25, 0, 0.0, 168.88000000000002, 2, 612, 55.0, 569.0000000000001, 606.3, 612.0, 2.244568145088885, 0.5545661530346562, 1.1091323060693123], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 50, 0, 0.0, 38.459999999999994, 2, 711, 8.5, 113.6999999999999, 148.2499999999998, 711.0, 0.31553704404897137, 0.0816575358134545, 0.12911134907863184], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0", 25, 0, 0.0, 254.11999999999998, 2, 659, 185.0, 558.8000000000001, 631.0999999999999, 659.0, 2.9253451907325063, 1.165567224432483, 1.29697921542242], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1", 25, 0, 0.0, 203.72, 6, 978, 109.0, 576.2, 860.6999999999997, 978.0, 2.7391256710857896, 109.06214048975566, 1.1421940054234687], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable", 25, 0, 0.0, 961.12, 402, 1540, 906.0, 1495.2, 1536.1, 1540.0, 1.8455632659087555, 7.22905689410158, 0.8254570076037206], "isController": false}, {"data": ["Test", 25, 25, 100.0, 12763.839999999998, 6646, 18427, 13597.0, 16470.800000000003, 18051.1, 18427.0, 1.2875978574371651, 287.9126650539503, 527.6560930740111], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 50, 0, 0.0, 54.480000000000004, 1, 589, 4.5, 76.99999999999999, 584.8, 589.0, 0.3156047618446467, 0.07797656713544494, 0.14023453773370534], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC", 25, 0, 0.0, 1204.48, 516, 2026, 1260.0, 1774.6000000000001, 1963.8999999999999, 2026.0, 1.7606873723501657, 2.4931608299880272, 1.1554510881047961], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC", 25, 0, 0.0, 172.00000000000003, 3, 647, 123.0, 456.8000000000002, 605.5999999999999, 647.0, 1.8390466382227453, 0.4543738276077682, 1.0883420534794763], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 50, 50, 100.0, 408.86, 12, 4187, 71.5, 1003.9, 2406.699999999987, 4187.0, 0.31503008537315313, 12.68242210881139, 0.2544237115269508], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 100, 0, 0.0, 235.95999999999998, 2, 1387, 52.5, 731.4000000000005, 901.8499999999999, 1385.069999999999, 0.6317598301829576, 0.15608909866825027, 0.28071359641918525], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 23, 17.96875, 2.5555555555555554], "isController": false}, {"data": ["The operation lasted too long: It took 4,608 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.78125, 0.1111111111111111], "isController": false}, {"data": ["The operation lasted too long: It took 4,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.78125, 0.1111111111111111], "isController": false}, {"data": ["The operation lasted too long: It took 3,275 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.78125, 0.1111111111111111], "isController": false}, {"data": ["The operation lasted too long: It took 3,088 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.78125, 0.1111111111111111], "isController": false}, {"data": ["500/Internal Server Error", 50, 39.0625, 5.555555555555555], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 50, 39.0625, 5.555555555555555], "isController": false}, {"data": ["The operation lasted too long: It took 4,187 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.78125, 0.1111111111111111], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 900, 128, "500/Internal Server Error", 50, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 50, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 23, "The operation lasted too long: It took 4,608 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 25, 25, "500/Internal Server Error", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 50, 25, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 50, 3, "The operation lasted too long: It took 4,608 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,275 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,088 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 25, 25, "500/Internal Server Error", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 50, 50, "The result was the wrong size: It was 41,180 bytes, but should have been less than 40,000 bytes.", 25, "The result was the wrong size: It was 41,268 bytes, but should have been less than 40,000 bytes.", 23, "The operation lasted too long: It took 4,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,187 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
