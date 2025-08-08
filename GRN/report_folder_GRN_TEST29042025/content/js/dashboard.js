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

    var data = {"OkPercent": 94.73684210526316, "KoPercent": 5.2631578947368425};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.91875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems"], "isController": false}, {"data": [0.75, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList"], "isController": false}, {"data": [0.0, 500, 1500, "Add New GRN Scenario"], "isController": true}, {"data": [1.0, 500, 1500, "openGRN Scenario"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 380, 20, 5.2631578947368425, 42.46052631578951, 2, 777, 9.0, 71.0, 327.6499999999999, 527.9199999999998, 2.064858285515563, 18.93188285529147, 1.1052340761389323], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 10, 10, 100.0, 37.1, 26, 48, 36.5, 47.9, 48.0, 48.0, 0.5526083112290009, 24.960734589135722, 0.32487324546861185], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 10, 0, 0.0, 41.49999999999999, 27, 68, 36.0, 66.60000000000001, 68.0, 68.0, 0.5508427894678859, 0.35342159441445414, 0.26681447614850723], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 10, 0, 0.0, 12.1, 5, 36, 10.5, 33.900000000000006, 36.0, 36.0, 0.5550929780738274, 0.314950215098529, 0.24285317790729946], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0", 20, 0, 0.0, 10.950000000000001, 2, 54, 6.0, 44.10000000000004, 53.599999999999994, 54.0, 0.10877309388749598, 0.04333927959579918, 0.04535753036128983], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1", 20, 0, 0.0, 10.199999999999998, 6, 21, 9.0, 15.900000000000002, 20.749999999999996, 21.0, 0.1087748686543461, 4.335698280269327, 0.042596408525774204], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 10, 0, 0.0, 29.7, 11, 77, 27.5, 73.10000000000002, 77.0, 77.0, 0.5519372999227288, 0.17894842145932224, 0.2996847058174192], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 10, 0, 0.0, 540.6999999999999, 458, 777, 494.5, 764.0, 777.0, 777.0, 0.5403360890473875, 0.1329733344140055, 0.40894577051926295], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 20, 0, 0.0, 21.55, 11, 61, 16.0, 54.70000000000003, 60.75, 61.0, 0.1087683614590188, 4.378776301549405, 0.08794941727350347], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 10, 0, 0.0, 18.799999999999997, 5, 45, 13.0, 44.2, 45.0, 45.0, 0.5547850208044383, 0.13652912621359226, 0.3770804438280167], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin", 10, 0, 0.0, 3.1, 2, 5, 3.0, 4.9, 5.0, 5.0, 0.5515111405250386, 0.1362620298367527, 0.2741398149680123], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 10, 10, 100.0, 348.5, 321, 392, 340.5, 392.0, 392.0, 392.0, 0.5420347986340723, 24.48314017697436, 0.264136098162502], "isController": false}, {"data": ["Add New GRN Scenario", 10, 10, 100.0, 1470.3000000000002, 1200, 1652, 1491.0, 1639.9, 1652.0, 1652.0, 1.8165304268846503, 337.6067921207993, 26.696256244323344], "isController": true}, {"data": ["openGRN Scenario", 10, 0, 0.0, 81.10000000000001, 32, 215, 77.0, 203.70000000000005, 215.0, 215.0, 2.2212350066637048, 92.90141881386052, 7.043310611950245], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1", 10, 0, 0.0, 8.0, 6, 17, 7.0, 16.200000000000003, 17.0, 17.0, 0.5514503143266791, 21.956769741921253, 0.22995047286864453], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 10, 0, 0.0, 14.0, 4, 25, 13.0, 24.5, 25.0, 25.0, 0.5511160099200882, 0.9240880752273354, 0.2513390396803527], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0", 10, 0, 0.0, 11.8, 4, 43, 7.5, 40.60000000000001, 43.0, 43.0, 0.5514503143266791, 0.21971848461453622, 0.24179803821550677], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 30, 0, 0.0, 8.733333333333334, 2, 52, 5.0, 16.700000000000006, 47.599999999999994, 52.0, 0.16318981695542198, 0.0403193590719939, 0.07235173525172028], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 10, 0, 0.0, 24.000000000000004, 5, 72, 15.0, 70.7, 72.0, 72.0, 0.5516936996579499, 0.2036525571002979, 0.23382330630034204], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 20, 0, 0.0, 9.6, 2, 59, 3.5, 24.700000000000006, 57.299999999999976, 59.0, 0.1087961703748028, 0.02815525893488549, 0.04451718299515857], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 20, 0, 0.0, 5.1000000000000005, 2, 32, 3.0, 6.900000000000002, 30.749999999999982, 32.0, 0.10879972147271304, 0.026881181184176168, 0.03782490316824789], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 10, 0, 0.0, 189.5, 135, 262, 167.0, 261.7, 262.0, 262.0, 0.548757065247215, 2.5508629204851014, 0.30063741562860125], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 20, 0, 0.0, 18.000000000000004, 4, 129, 8.0, 51.00000000000002, 125.14999999999995, 129.0, 4.610419548178885, 1.2066332411249423, 1.7716797775472568], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 10, 0, 0.0, 13.5, 6, 25, 12.0, 24.5, 25.0, 25.0, 0.5512071436445817, 0.31328374765736966, 0.24976573696395107], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata", 10, 0, 0.0, 6.0, 2, 18, 4.5, 17.000000000000004, 18.0, 18.0, 0.5537405171936431, 0.136812842626945, 0.2709218741347804], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 10, 0, 0.0, 15.4, 9, 28, 12.5, 27.700000000000003, 28.0, 28.0, 0.5512071436445817, 1.64716197221916, 0.24545943115422778], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 20, 0, 0.0, 45.500000000000014, 11, 131, 41.5, 85.00000000000003, 128.74999999999997, 131.0, 1.0647359454855196, 21.5827383012138, 1.6646896960178876], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 50, 0, 0.0, 6.36, 2, 35, 3.0, 16.9, 25.749999999999936, 35.0, 0.2720007833622561, 0.0672033185455574, 0.12085972307600246], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 20, 100.0, 5.2631578947368425], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 380, 20, "500/Internal Server Error", 20, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
