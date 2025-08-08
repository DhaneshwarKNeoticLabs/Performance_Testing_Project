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

    var data = {"OkPercent": 84.95614035087719, "KoPercent": 15.043859649122806};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8108333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils"], "isController": false}, {"data": [0.7, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes"], "isController": false}, {"data": [0.65, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList"], "isController": false}, {"data": [0.0, 500, 1500, "Add New GRN Scenario"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "openGRN Scenario"], "isController": true}, {"data": [0.9833333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0"], "isController": false}, {"data": [0.9944444444444445, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.525, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN"], "isController": false}, {"data": [0.8625, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2280, 343, 15.043859649122806, 1887.7723684210523, 1, 32186, 18.0, 14681.9, 15093.95, 23955.910000000014, 7.942839425746644, 99.95992246369113, 4.251476653974381], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 60, 60, 100.0, 9466.166666666666, 29, 15196, 15033.0, 15111.5, 15166.55, 15196.0, 0.609372143568077, 27.52469702778737, 0.35824417033982653], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 60, 11, 18.333333333333332, 2888.0, 33, 15254, 122.0, 15065.3, 15133.95, 15254.0, 0.725566546545094, 4.2347389169710015, 0.3514462959827799], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 60, 10, 16.666666666666668, 2796.6333333333328, 4, 15188, 84.0, 15092.6, 15124.55, 15188.0, 0.5278298276635612, 3.8307868293262253, 0.23092554960280806], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0", 120, 0, 0.0, 14.516666666666673, 2, 109, 7.0, 38.0, 57.94999999999999, 102.06999999999974, 0.41853700390285753, 0.1667608374925448, 0.1745266608071486], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1", 120, 0, 0.0, 12.166666666666664, 6, 78, 8.0, 23.80000000000001, 37.69999999999993, 72.7499999999998, 0.4184888368102781, 16.680703479734678, 0.16388088238371243], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 60, 25, 41.666666666666664, 6383.116666666668, 20, 15302, 262.0, 15158.2, 15215.5, 15302.0, 0.7234145165179648, 8.885564866168314, 0.3927914757656137], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 60, 35, 58.333333333333336, 2439.1166666666663, 283, 15202, 473.5, 15090.8, 15150.2, 15202.0, 0.5263434917627243, 13.922359331960454, 0.398355670035265], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 120, 0, 0.0, 26.899999999999995, 8, 118, 18.5, 58.80000000000001, 76.79999999999995, 115.89999999999992, 0.41846402778601144, 16.84644636860404, 0.3383673974675952], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 60, 21, 35.0, 5302.95, 6, 15228, 51.5, 15080.9, 15095.85, 15228.0, 0.5278066116574887, 8.428592232555992, 0.35874355636094934], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin", 60, 0, 0.0, 16.450000000000003, 1, 50, 10.0, 37.9, 48.89999999999999, 50.0, 1.1378937586527338, 0.2811397665421305, 0.565613206205314], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 60, 60, 100.0, 4574.633333333333, 35, 15137, 500.5, 14718.3, 15040.95, 15137.0, 0.8841863275320886, 39.937763874357124, 0.4308681420297971], "isController": false}, {"data": ["Add New GRN Scenario", 60, 60, 100.0, 71352.13333333333, 1583, 109133, 88340.0, 101848.0, 103144.34999999999, 109133.0, 0.5387302128882224, 170.06199395836512, 7.91733493530748], "isController": true}, {"data": ["openGRN Scenario", 60, 2, 3.3333333333333335, 185.03333333333333, 29, 3190, 66.0, 153.9, 275.7499999999997, 3190.0, 11.945052757316345, 499.5924995022895, 37.87654912402947], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1", 60, 0, 0.0, 50.483333333333334, 5, 1058, 7.0, 72.19999999999997, 121.89999999999982, 1058.0, 2.5649794801641588, 102.12826500512996, 1.0695764043262654], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 60, 11, 18.333333333333332, 2795.5, 4, 15080, 42.5, 14719.3, 14951.9, 15080.0, 1.1399908800729595, 2.7378335660814717, 0.5198981845645235], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0", 60, 0, 0.0, 94.33333333333334, 3, 1041, 16.5, 80.6, 863.9499999999996, 1041.0, 2.6806058169146225, 1.06805388017692, 1.1753828240182282], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 180, 0, 0.0, 22.89444444444444, 2, 1060, 4.0, 34.900000000000006, 53.799999999999955, 957.1299999999997, 0.6278230236654401, 0.15511643065171518, 0.27835122338291973], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 60, 27, 45.0, 6883.299999999999, 6, 15260, 732.0, 15175.1, 15199.8, 15260.0, 0.725268349289237, 12.722946829519632, 0.3073891246011024], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 120, 0, 0.0, 8.016666666666671, 1, 75, 3.0, 18.0, 44.94999999999999, 73.94999999999996, 0.41850051266312804, 0.10830335532786027, 0.1712419089900885], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 120, 0, 0.0, 6.224999999999998, 1, 99, 2.0, 13.900000000000006, 19.0, 96.2699999999999, 0.4185048912759168, 0.10340013427031929, 0.14549584110764294], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 60, 23, 38.333333333333336, 6429.566666666666, 454, 16129, 1201.5, 15151.2, 15168.3, 16129.0, 0.6121761843058432, 11.94108234662436, 0.3353816790972442], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 120, 2, 1.6666666666666667, 67.2166666666667, 3, 3126, 8.0, 44.900000000000006, 63.449999999999875, 3116.7599999999998, 24.844720496894407, 6.502329192546584, 9.547263198757763], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 60, 41, 68.33333333333333, 16483.58333333333, 6, 32186, 20641.0, 29531.8, 30416.6, 32186.0, 1.5804446317564007, 44.447638716942365, 0.7161389737646191], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata", 60, 0, 0.0, 60.79999999999999, 1, 1996, 19.0, 77.6, 100.49999999999996, 1996.0, 0.6088774329727425, 0.15043553763877332, 0.2978980409368594], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 60, 5, 8.333333333333334, 1402.2000000000003, 4, 14974, 59.0, 550.5, 14921.399999999998, 14974.0, 1.139211665527455, 3.4042848598769653, 0.5073051948051948], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 120, 12, 10.0, 1618.1250000000002, 9, 15174, 72.5, 11964.600000000064, 15059.1, 15162.66, 1.0452051215050953, 23.1397509336077, 1.6341537104781814], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 300, 0, 0.0, 18.69999999999998, 1, 135, 7.0, 50.900000000000034, 71.89999999999998, 106.92000000000007, 1.0462731749508252, 0.2585030402954675, 0.4648967720728764], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 14,930 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,094 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,952 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,937 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,191 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,718 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 16,129 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,110 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,944 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,624 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,971 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,889 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 3,082 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,905 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 12,912 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,106 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,625 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 0.5830903790087464, 0.08771929824561403], "isController": false}, {"data": ["The operation lasted too long: It took 14,967 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,974 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 0.5830903790087464, 0.08771929824561403], "isController": false}, {"data": ["The operation lasted too long: It took 14,647 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,608 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,044 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,115 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 3,126 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,096 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,081 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,723 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,085 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 13,089 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,107 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,686 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 11,801 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,196 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,302 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,032 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["500/Internal Server Error", 297, 86.58892128279884, 13.026315789473685], "isController": false}, {"data": ["The operation lasted too long: It took 15,003 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,678 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,950 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,943 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 14,656 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 0.5830903790087464, 0.08771929824561403], "isController": false}, {"data": ["The operation lasted too long: It took 14,645 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}, {"data": ["The operation lasted too long: It took 15,159 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.2915451895043732, 0.043859649122807015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2280, 343, "500/Internal Server Error", 297, "The operation lasted too long: It took 14,625 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 14,974 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 14,656 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 14,930 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 60, 60, "500/Internal Server Error", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 60, 11, "500/Internal Server Error", 7, "The operation lasted too long: It took 14,718 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,967 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,645 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,647 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 60, 10, "500/Internal Server Error", 9, "The operation lasted too long: It took 15,044 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 60, 25, "500/Internal Server Error", 16, "The operation lasted too long: It took 15,032 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 15,115 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 15,096 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 15,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 60, 35, "500/Internal Server Error", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 60, 21, "500/Internal Server Error", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 60, 60, "500/Internal Server Error", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 60, 11, "The operation lasted too long: It took 14,656 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 14,952 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "500/Internal Server Error", 1, "The operation lasted too long: It took 14,723 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,686 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 60, 27, "500/Internal Server Error", 23, "The operation lasted too long: It took 15,191 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,625 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 15,196 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,943 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 60, 23, "500/Internal Server Error", 22, "The operation lasted too long: It took 16,129 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 120, 2, "The operation lasted too long: It took 3,126 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,082 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 60, 41, "500/Internal Server Error", 38, "The operation lasted too long: It took 15,003 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 12,912 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 11,801 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 60, 5, "The operation lasted too long: It took 14,608 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,937 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,625 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,971 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,974 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 120, 12, "500/Internal Server Error", 5, "The operation lasted too long: It took 14,930 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 15,094 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,889 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,905 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
