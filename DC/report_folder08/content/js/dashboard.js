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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8027027027027027, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.8, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180, 25, 13.88888888888889, 105.70555555555558, 2, 1052, 10.0, 401.8, 652.55, 1020.4099999999999, 1.5212081773390689, 14.550143286718162, 17.42097805498745], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-0", 10, 0, 0.0, 47.89999999999999, 4, 193, 14.0, 184.00000000000003, 193.0, 193.0, 0.08520645524104907, 0.03394944701010549, 0.035447216731139555], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetDeliveryChallanDetails?PONo=PO%2FSO%2F2526%2F200005&PoRevision=2", 5, 0, 0.0, 52.8, 25, 105, 25.0, 105.0, 105.0, 105.0, 0.6672004270082733, 1.0275147201094208, 0.2703986105551108], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountDCforMail", 10, 0, 0.0, 6.0, 2, 22, 3.5, 20.800000000000004, 22.0, 22.0, 0.08531112968997936, 0.021077847472231227, 0.03815673574024467], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPONo", 5, 5, 100.0, 341.0, 317, 382, 324.0, 382.0, 382.0, 382.0, 0.6420133538777606, 28.99906607119928, 0.2909123009758603], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan", 10, 5, 50.0, 71.8, 10, 141, 69.5, 140.8, 141.0, 141.0, 1.1079104808331486, 22.431400433469975, 1.2545138696543319], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GenerateEWayBill", 5, 0, 0.0, 159.8, 137, 211, 153.0, 211.0, 211.0, 211.0, 0.6611133148221605, 0.1923943045087928, 1.5462562392569086], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan-1", 10, 0, 0.0, 10.6, 7, 24, 7.5, 23.400000000000002, 24.0, 24.0, 0.08527839130842635, 3.3991433785593066, 0.03339515128386618], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockDetailsForDC", 5, 0, 0.0, 111.4, 107, 115, 112.0, 115.0, 115.0, 115.0, 0.6656903208627346, 0.24638342930368792, 0.3920031869924111], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetJsonDataForDc", 5, 0, 0.0, 6.8, 3, 17, 5.0, 17.0, 17.0, 17.0, 0.6729475100942126, 0.16626535161507403, 0.30755804172274565], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCompanyShortName", 5, 0, 0.0, 3.6, 2, 6, 3.0, 6.0, 6.0, 6.0, 0.671591672263264, 0.16593036433848218, 0.26758730691739424], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 15, 0, 0.0, 4.866666666666665, 2, 21, 3.0, 13.800000000000004, 21.0, 21.0, 0.12795032115530608, 0.031612725832316835, 0.05672797441846579], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendPendingDCmail", 10, 0, 0.0, 831.9, 620, 1052, 863.5, 1048.1, 1052.0, 1052.0, 0.08465178488288426, 0.021162946220721065, 16.62762764431013], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/IsvalidDCForSealed", 5, 5, 100.0, 37.6, 34, 41, 39.0, 41.0, 41.0, 41.0, 0.6717721348918447, 30.343238823391108, 0.3568789466612925], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetCountOfDC", 5, 0, 0.0, 3.6, 2, 5, 3.0, 5.0, 5.0, 5.0, 0.6724949562878278, 0.16615353900470747, 0.33230707800941495], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 10, 0, 0.0, 6.5, 2, 18, 3.0, 17.6, 18.0, 18.0, 0.08531549670682183, 0.022078717409480256, 0.03490936828140463], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-0", 5, 0, 0.0, 6.6, 3, 10, 6.0, 10.0, 10.0, 10.0, 0.6709608158883522, 0.2673359500805153, 0.2974767679817499], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ManageDeliveryChallan-1", 5, 0, 0.0, 7.0, 6, 8, 7.0, 8.0, 8.0, 8.0, 0.670870790285791, 26.711663927277606, 0.2797478783711257], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoItemForPopup?PONo=PO%2FSO%2F2526%2F200005&ItemCode=41555&PoRevision=2&StoreCode=WIP&Returnable=Returnable", 5, 0, 0.0, 442.0, 397, 529, 402.0, 529.0, 529.0, 529.0, 0.6354047528275512, 2.4888754527258863, 0.2841947039013852], "isController": false}, {"data": ["Test", 5, 5, 100.0, 3674.8, 3315, 3849, 3761.0, 3849.0, 3849.0, 3849.0, 0.952018278750952, 212.87556377332444, 390.13597498571977], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 10, 0, 0.0, 10.2, 2, 53, 3.0, 50.10000000000001, 53.0, 53.0, 0.08532496011058115, 0.02108126455857132, 0.03791294614288518], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetSelectedItemDetailsForDC", 5, 0, 0.0, 508.4, 452, 653, 467.0, 653.0, 653.0, 653.0, 0.6367804381049414, 0.9016910500509424, 0.4178871625063678], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/getStockLotDetailsForDC", 5, 0, 0.0, 5.4, 4, 7, 5.0, 7.0, 7.0, 7.0, 0.6750371270419874, 0.166781633927366, 0.3994848622924261], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListDeliveryChallan", 10, 10, 100.0, 59.099999999999994, 15, 200, 28.5, 192.40000000000003, 200.0, 200.0, 0.08520137344613996, 3.430020916937181, 0.06881009359370872], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 20, 0, 0.0, 4.199999999999999, 2, 12, 3.0, 10.900000000000002, 11.95, 12.0, 0.17050007672503453, 0.04212550723772825, 0.07575931143544014], "isController": false}]}, function(index, item){
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
