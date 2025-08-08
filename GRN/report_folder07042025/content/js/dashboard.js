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

    var data = {"OkPercent": 86.84210526315789, "KoPercent": 13.157894736842104};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.81875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems"], "isController": false}, {"data": [0.75, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList"], "isController": false}, {"data": [0.0, 500, 1500, "Add New GRN Scenario"], "isController": true}, {"data": [0.0, 500, 1500, "openGRN Scenario"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 380, 50, 13.157894736842104, 36.126315789473686, 2, 825, 6.0, 45.7000000000001, 371.4999999999999, 543.23, 2.2108576382222376, 20.18163259109606, 1.1833815503930092], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 10, 10, 100.0, 37.7, 34, 43, 37.0, 42.9, 43.0, 43.0, 0.5287648054145516, 23.883748578944587, 0.31085587193316416], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 10, 0, 0.0, 32.5, 27, 52, 28.5, 51.1, 52.0, 52.0, 0.5276766397551581, 0.33495099203208273, 0.25559337238140467], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 10, 0, 0.0, 8.7, 4, 18, 7.0, 17.700000000000003, 18.0, 18.0, 0.5310956503266238, 0.30133454378883634, 0.23235434701789792], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0", 20, 0, 0.0, 5.699999999999999, 2, 15, 4.0, 13.800000000000004, 14.95, 15.0, 0.1164239227876544, 0.04638765673570605, 0.048547866240555106], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1", 20, 0, 0.0, 7.65, 6, 12, 7.0, 9.900000000000002, 11.899999999999999, 12.0, 0.11642256735045521, 4.640530770484551, 0.045591259284699745], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 10, 0, 0.0, 25.0, 11, 54, 18.0, 52.800000000000004, 54.0, 54.0, 0.5286250462546915, 0.17139015171538827, 0.28702688058360204], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 10, 0, 0.0, 521.4, 395, 825, 501.5, 798.9000000000001, 825.0, 825.0, 0.5195075068834745, 0.12784755052210506, 0.3931819510104421], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 20, 20, 100.0, 13.700000000000001, 9, 23, 11.5, 22.0, 22.95, 23.0, 0.11641579063784212, 4.686645071537503, 0.09413308071106764], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 10, 0, 0.0, 12.4, 5, 31, 9.5, 30.1, 31.0, 31.0, 0.5303351718285957, 0.13051217119219347, 0.3604621871022486], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin", 10, 0, 0.0, 4.0, 2, 11, 3.0, 10.400000000000002, 11.0, 11.0, 0.5287927661149596, 0.13064899397176247, 0.26284718550050234], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 10, 10, 100.0, 385.00000000000006, 362, 402, 387.0, 401.9, 402.0, 402.0, 0.5182152666217547, 23.407237038140643, 0.25252872855884334], "isController": false}, {"data": ["Add New GRN Scenario", 10, 10, 100.0, 1291.7000000000003, 1127, 1643, 1247.5, 1613.3000000000002, 1643.0, 1643.0, 1.826817683595177, 336.72852632900987, 26.84744074260139], "isController": true}, {"data": ["openGRN Scenario", 10, 10, 100.0, 42.7, 30, 101, 35.5, 95.60000000000002, 101.0, 101.0, 2.2271714922048997, 93.14970768374164, 7.06213460467706], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1", 10, 0, 0.0, 6.8, 6, 11, 6.0, 10.600000000000001, 11.0, 11.0, 0.5278994879374966, 21.01906047088634, 0.2201299622551866], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 10, 0, 0.0, 9.9, 4, 19, 8.0, 18.8, 19.0, 19.0, 0.5281504172388296, 0.8855803382803422, 0.24086547348684903], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0", 10, 0, 0.0, 4.9, 4, 9, 4.0, 8.700000000000001, 9.0, 9.0, 0.5279831045406547, 0.2103682682154171, 0.2315082167370644], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 30, 0, 0.0, 3.4000000000000004, 2, 12, 3.0, 4.0, 9.799999999999997, 12.0, 0.17465113435911767, 0.04315111034458669, 0.07743321777249944], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 10, 0, 0.0, 11.6, 4, 39, 8.5, 36.900000000000006, 39.0, 39.0, 0.5286250462546915, 0.19513697996511073, 0.22404616218216417], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 20, 0, 0.0, 3.05, 2, 8, 3.0, 3.900000000000002, 7.799999999999997, 8.0, 0.11643612314284384, 0.03013239514927111, 0.047643296481300355], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 20, 0, 0.0, 2.95, 2, 9, 2.0, 6.6000000000000085, 8.899999999999999, 9.0, 0.1164368010153289, 0.02876807681335763, 0.04047998160298544], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 10, 0, 0.0, 116.4, 95, 140, 112.5, 139.9, 140.0, 140.0, 0.5263989050902774, 1.337587842817287, 0.2883884626519977], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 20, 0, 0.0, 8.95, 4, 59, 6.0, 9.800000000000004, 56.54999999999997, 59.0, 4.63070155128502, 1.2119414216253763, 1.7794736918268117], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 10, 0, 0.0, 11.8, 6, 21, 11.5, 20.6, 21.0, 21.0, 0.5279552293965472, 0.30006830420780317, 0.23922971332031046], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata", 10, 0, 0.0, 5.699999999999999, 2, 32, 2.0, 29.500000000000007, 32.0, 32.0, 0.5298574683410162, 0.13091205028347375, 0.25923690589731363], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 10, 0, 0.0, 10.3, 4, 17, 12.0, 16.8, 17.0, 17.0, 0.5285132921092965, 1.8895382445431004, 0.23535357539242113], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 20, 10, 50.0, 29.95, 10, 70, 26.0, 63.10000000000002, 69.69999999999999, 70.0, 1.0198878123406425, 20.67364386792453, 1.594570690973993], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 50, 0, 0.0, 2.9200000000000004, 2, 14, 2.0, 3.8999999999999986, 9.14999999999997, 14.0, 0.29110047624037916, 0.07192228563360929, 0.12934640301696534], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 10, 20.0, 2.6315789473684212], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 20, 40.0, 5.2631578947368425], "isController": false}, {"data": ["500/Internal Server Error", 20, 40.0, 5.2631578947368425], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 380, 50, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 20, "500/Internal Server Error", 20, "The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 20, 20, "The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 10, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 10, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 10, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 20, 10, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
