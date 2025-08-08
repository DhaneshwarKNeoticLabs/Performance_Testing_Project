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

    var data = {"OkPercent": 81.78947368421052, "KoPercent": 18.210526315789473};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7675, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC"], "isController": false}, {"data": [0.96, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils"], "isController": false}, {"data": [0.92, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems"], "isController": false}, {"data": [0.3, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes"], "isController": false}, {"data": [0.88, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList"], "isController": false}, {"data": [0.0, 500, 1500, "Add New GRN Scenario"], "isController": true}, {"data": [0.0, 500, 1500, "openGRN Scenario"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.96, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [0.84, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu"], "isController": false}, {"data": [0.44, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN"], "isController": false}, {"data": [0.24, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 950, 173, 18.210526315789473, 912.7315789473673, 1, 30267, 13.0, 442.69999999999993, 4897.89999999985, 18361.11000000001, 4.054630815194195, 43.40797805297695, 2.1702778222364487], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 25, 25, 100.0, 7865.280000000001, 40, 15055, 15023.0, 15044.4, 15052.0, 15055.0, 0.5108400253376653, 23.074105167913117, 0.30031806177077586], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 25, 1, 4.0, 679.2399999999999, 44, 15032, 75.0, 148.0000000000001, 10576.69999999999, 15032.0, 0.7357052470498219, 1.7775615877254936, 0.3563572290397575], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 25, 2, 8.0, 1254.3999999999996, 4, 15049, 24.0, 6236.000000000031, 15048.4, 15049.0, 0.39550704002531245, 1.6356224539234299, 0.17303433001107418], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-0", 50, 0, 0.0, 7.04, 2, 84, 4.0, 14.0, 16.449999999999996, 84.0, 0.2135210040611695, 0.08507477505562222, 0.08903659056066345], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes-1", 50, 0, 0.0, 14.22, 6, 184, 7.5, 22.0, 32.34999999999999, 184.0, 0.21351918042797785, 8.51074108237143, 0.08361444467931554], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItems", 25, 0, 0.0, 100.75999999999999, 37, 198, 104.0, 169.4, 189.59999999999997, 198.0, 0.7341928284044522, 0.23803908108425595, 0.39864376229772985], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 25, 13, 52.0, 1064.96, 276, 15340, 440.0, 803.6000000000003, 11000.499999999989, 15340.0, 0.3955258120144921, 9.33677304827788, 0.29934814874143684], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 50, 50, 100.0, 21.56, 9, 268, 12.0, 33.19999999999999, 49.0, 268.0, 0.21351097446408746, 8.59548477666752, 0.1726436395080707], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 25, 3, 12.0, 1842.76, 6, 15047, 13.0, 15033.4, 15045.8, 15047.0, 0.39516944865958525, 2.2275053496064112, 0.2685917346358118], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorDropdownListByGin", 25, 0, 0.0, 39.28, 2, 278, 19.0, 102.80000000000004, 229.3999999999999, 278.0, 0.729905696184053, 0.18033802845172406, 0.3628144524977373], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 25, 25, 100.0, 336.95999999999987, 34, 827, 410.0, 675.4000000000004, 819.5, 827.0, 0.7286930162061327, 32.91429499861548, 0.35509552254576193], "isController": false}, {"data": ["Add New GRN Scenario", 25, 25, 100.0, 34316.04, 3022, 61920, 33125.0, 60811.8, 61682.4, 61920.0, 0.3785985794981297, 92.47833765408961, 5.5639941629564005], "isController": true}, {"data": ["openGRN Scenario", 25, 25, 100.0, 52.320000000000014, 26, 146, 45.0, 95.0, 130.69999999999996, 146.0, 2.5976724854530344, 108.64562227244389, 8.236955625259768], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-1", 25, 0, 0.0, 76.96, 6, 383, 8.0, 357.2, 375.79999999999995, 383.0, 1.1120007116804553, 44.27587208655814, 0.46369560926518993], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGRNTypeList", 25, 0, 0.0, 97.08000000000001, 5, 390, 38.0, 297.40000000000026, 384.0, 390.0, 0.7300335815447511, 1.2240895112425172, 0.3329352368958972], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes-0", 25, 0, 0.0, 195.96, 4, 1046, 64.0, 1037.2, 1043.9, 1046.0, 1.112099644128114, 0.4431022019572954, 0.48762962911476865], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 75, 0, 0.0, 20.200000000000006, 2, 519, 3.0, 29.200000000000045, 112.80000000000001, 519.0, 0.3203170711915368, 0.07914083887837774, 0.14201557648531027], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 25, 1, 4.0, 627.7199999999999, 8, 14900, 30.0, 82.00000000000006, 10459.999999999989, 14900.0, 0.7372673921377806, 0.2721553459258604, 0.3124746564333953], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 50, 0, 0.0, 7.420000000000001, 2, 149, 2.0, 11.499999999999993, 35.64999999999984, 149.0, 0.21354836229760954, 0.055263980477408714, 0.08737965215107266], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 50, 0, 0.0, 3.48, 1, 15, 2.0, 8.899999999999999, 12.449999999999996, 15.0, 0.2135520105921797, 0.05276236199201316, 0.07424269118243748], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 25, 1, 4.0, 1056.4000000000003, 311, 15037, 466.0, 773.4000000000004, 10795.89999999999, 15037.0, 0.7267019359339574, 3.085672935076449, 0.39812479107319343], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 50, 0, 0.0, 9.680000000000001, 3, 92, 6.0, 17.9, 26.649999999999928, 92.0, 5.307855626326964, 1.3891653397027601, 2.039688661093418], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 25, 14, 56.0, 10815.560000000001, 16, 30267, 3907.0, 28723.400000000005, 30181.2, 30267.0, 0.6165836334040349, 11.350437620233809, 0.2793894588862033], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetInvoicedata", 25, 0, 0.0, 59.08, 2, 370, 5.0, 353.6, 366.7, 370.0, 0.5127889565770312, 0.126694927748036, 0.25088600316903575], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetRackForRMGIN", 25, 0, 0.0, 56.36000000000001, 6, 380, 26.0, 185.2000000000004, 354.49999999999994, 380.0, 0.7301615117263939, 3.277170222553229, 0.3251500481906598], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 50, 38, 76.0, 4085.7800000000007, 11, 15137, 313.5, 15038.7, 15050.15, 15137.0, 0.7002114638620864, 16.07760739055695, 1.0947642125421877], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 125, 0, 0.0, 31.21599999999999, 1, 356, 4.0, 74.20000000000019, 208.0999999999986, 356.0, 0.5338845869655281, 0.13190703174050647, 0.2372241084661282], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 15,137 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 15,033 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 50, 28.90173410404624, 5.2631578947368425], "isController": false}, {"data": ["The operation lasted too long: It took 6,109 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 14,900 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 6,318 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 15,039 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 15,028 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 15,002 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 1.1560693641618498, 0.21052631578947367], "isController": false}, {"data": ["The operation lasted too long: It took 14,975 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 14,927 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 15,054 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 25, 14.45086705202312, 2.6315789473684212], "isController": false}, {"data": ["The operation lasted too long: It took 3,907 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["500/Internal Server Error", 83, 47.97687861271676, 8.736842105263158], "isController": false}, {"data": ["The operation lasted too long: It took 15,027 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}, {"data": ["The operation lasted too long: It took 3,465 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.5780346820809249, 0.10526315789473684], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 950, 173, "500/Internal Server Error", 83, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 50, "The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 25, "The operation lasted too long: It took 15,002 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 15,137 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPrimaryUOMonDC", 25, 25, "500/Internal Server Error", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPoSoDeatils", 25, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetGinApprovers?TypeId=11&PlantId=2&GinId=GIN26200006", 25, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SentforQualityCheck", 25, 13, "500/Internal Server Error", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/ListGoodsInwardNotes", 50, 50, "The result was the wrong size: It was 41,268 bytes, but should have been less than 30,000 bytes.", 25, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 25, "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/SendMailToSalePerson", 25, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/FillCustomerNVendorPoNSoDropdownList", 25, 25, "500/Internal Server Error", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetStorePlantGrnTypeWise", 25, 1, "The operation lasted too long: It took 14,900 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/CustomerNVendorItemsDetails", 25, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetApplicationPreferencesSetting", 25, 14, "500/Internal Server Error", 10, "The operation lasted too long: It took 6,109 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,907 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,318 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,465 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GoodsInwardNotes", 50, 38, "The result was the wrong size: It was 41,180 bytes, but should have been less than 30,000 bytes.", 25, "500/Internal Server Error", 3, "The operation lasted too long: It took 15,002 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 15,137 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,927 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
