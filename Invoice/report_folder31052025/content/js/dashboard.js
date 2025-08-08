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

    var data = {"OkPercent": 98.78947368421052, "KoPercent": 1.2105263157894737};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.696, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid"], "isController": false}, {"data": [0.8, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice"], "isController": false}, {"data": [0.16, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice"], "isController": false}, {"data": [0.04, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv"], "isController": false}, {"data": [0.59, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty"], "isController": false}, {"data": [0.7966666666666666, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype"], "isController": false}, {"data": [0.45, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid"], "isController": false}, {"data": [0.67, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [0.55, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv"], "isController": false}, {"data": [0.69, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList"], "isController": false}, {"data": [0.82, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities"], "isController": false}, {"data": [0.66, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList"], "isController": false}, {"data": [0.83, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal"], "isController": false}, {"data": [0.83, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1"], "isController": false}, {"data": [0.6, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice"], "isController": false}, {"data": [0.84, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice"], "isController": false}, {"data": [0.81, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO"], "isController": false}, {"data": [0.0, 500, 1500, "Manage Invoice"], "isController": true}, {"data": [0.72, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount"], "isController": false}, {"data": [0.985, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [0.79, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData"], "isController": false}, {"data": [0.9133333333333333, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [0.76, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1"], "isController": false}, {"data": [0.25, 500, 1500, "Add invoice"], "isController": true}, {"data": [0.8, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode"], "isController": false}, {"data": [0.625, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice"], "isController": false}, {"data": [0.61, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice"], "isController": false}, {"data": [0.925, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}, {"data": [0.37, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1900, 23, 1.2105263157894737, 1402.1099999999988, 1, 33736, 110.0, 3643.8, 6204.599999999995, 30463.45, 11.474677199212476, 57.47061053020558, 7.150736210004711], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 50, 1, 2.0, 8047.000000000001, 1584, 30464, 6332.5, 17752.5, 19007.6, 30464.0, 0.6140997297961189, 0.23296209085605502, 0.45037978230164577], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice", 50, 0, 0.0, 466.01999999999987, 39, 1803, 217.5, 1661.6999999999996, 1793.85, 1803.0, 0.6572806982950138, 0.1912789532147599, 2.3280830983554837], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 50, 0, 0.0, 3034.7999999999997, 487, 8297, 2856.0, 7261.2, 7985.099999999999, 8297.0, 1.6531111551940754, 1.076782363783641, 0.8055688148846128], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 50, 1, 2.0, 5440.5999999999985, 999, 30605, 4446.0, 10818.699999999997, 15159.4, 30605.0, 0.6186281302583392, 2.7147625550579035, 0.30266864576116004], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty", 50, 0, 0.0, 1712.0199999999998, 10, 12617, 1036.5, 4748.3, 11638.199999999993, 12617.0, 0.6373080109616978, 0.20227060894780446, 0.4225899799247977], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 150, 0, 0.0, 760.5733333333333, 3, 5188, 46.5, 4613.5, 4693.2, 4957.480000000004, 0.9121313469139556, 0.481897518242627, 0.38183623441775616], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid", 50, 3, 6.0, 3820.2400000000007, 68, 31311, 799.0, 6156.9, 30857.8, 31311.0, 0.6257509010812976, 0.28371448081447737, 0.2853766316454746], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 50, 0, 0.0, 749.9200000000001, 8, 2590, 337.5, 2008.9, 2012.25, 2590.0, 5.747126436781609, 1.4199443247126438, 2.553654813218391], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv", 50, 1, 2.0, 1676.7399999999998, 29, 30556, 840.5, 3128.899999999999, 4220.0, 30556.0, 0.8298892927683447, 5.97053478066026, 0.3971149936098524], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 50, 2, 4.0, 2066.62, 19, 31051, 552.5, 1458.9, 20794.24999999992, 31051.0, 0.6876444053251183, 0.2649311238172516, 0.34717984136043567], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities", 50, 0, 0.0, 492.10000000000014, 4, 3150, 277.5, 1891.1, 1947.0999999999997, 3150.0, 0.6917734303660865, 0.17091667761974597, 0.30197531579457093], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 50, 0, 0.0, 2527.239999999999, 464, 10357, 490.0, 8946.9, 10316.3, 10357.0, 0.5451017159802019, 1.715154032117393, 0.2879883089309465], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 50, 2, 4.0, 1965.2200000000007, 3, 30015, 6.0, 6913.199999999999, 20051.749999999924, 30015.0, 0.39746891793061784, 0.15946887719005373, 0.1556494493068142], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1", 50, 0, 0.0, 299.46000000000004, 20, 619, 265.0, 606.0, 606.45, 619.0, 8.275405494869249, 330.2080747269116, 3.030544004468719], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice", 50, 0, 0.0, 674.8599999999999, 30, 1576, 489.0, 1564.0, 1572.9, 1576.0, 8.253549026081215, 332.6244738362496, 6.577046880158468], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0", 50, 0, 0.0, 374.8399999999999, 8, 1086, 46.0, 972.6, 1026.8999999999996, 1086.0, 8.893632159373887, 3.5435565635005335, 3.830167756136606], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice", 50, 0, 0.0, 17.060000000000002, 10, 100, 12.0, 28.9, 67.74999999999994, 100.0, 0.3974594392642231, 15.983769246973345, 0.3380734097647835], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO", 50, 0, 0.0, 454.49999999999994, 7, 1823, 68.5, 1145.9, 1214.0, 1823.0, 5.048975058063213, 1.2474518454003836, 1.8144754114914672], "isController": false}, {"data": ["Manage Invoice", 50, 23, 46.0, 47441.49999999999, 10176, 75703, 41492.5, 71735.5, 72714.2, 75703.0, 0.5878410947952549, 39.04705768999024, 10.508233633034317], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount", 50, 0, 0.0, 1233.92, 14, 13244, 133.5, 2781.3999999999987, 9795.149999999974, 13244.0, 0.6914577311888924, 0.18434371153766368, 0.33762584530707634], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 100, 0, 0.0, 66.40000000000002, 2, 681, 8.5, 214.60000000000082, 489.69999999999993, 680.8, 0.6092508651362285, 0.15052780164010332, 0.27011708278500757], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData", 50, 0, 0.0, 452.6999999999998, 2, 2000, 121.5, 1825.3999999999994, 1943.6499999999996, 2000.0, 0.6416014371872193, 0.15852066758629538, 0.2957381624534839], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 150, 0, 0.0, 185.06000000000006, 1, 3765, 15.5, 636.9, 722.5999999999997, 3107.6100000000115, 0.9139653911771874, 0.2365242467401901, 0.37576116180233976], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 50, 0, 0.0, 3.5000000000000004, 1, 23, 2.0, 6.899999999999999, 15.0, 23.0, 0.5220187509135328, 0.1289753359190662, 0.1814830813722829], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice", 50, 0, 0.0, 638.4200000000002, 8, 4405, 115.0, 1918.6999999999998, 4129.799999999999, 4405.0, 0.6407627639942587, 0.15831345633842528, 1.881614874346422], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0", 50, 0, 0.0, 6.960000000000001, 3, 93, 4.5, 8.0, 17.799999999999983, 93.0, 0.3974815568557619, 0.15837155780971762, 0.172345518792928], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1", 50, 0, 0.0, 9.839999999999998, 6, 63, 7.0, 10.799999999999997, 37.049999999999876, 63.0, 0.39747523729271667, 15.826035522361957, 0.16574406867577152], "isController": false}, {"data": ["Add invoice", 50, 0, 0.0, 5147.580000000002, 153, 13208, 3203.0, 11460.0, 12190.199999999993, 13208.0, 3.732736095558044, 161.9329448954834, 15.51782964725644], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode", 50, 0, 0.0, 552.6, 11, 1490, 73.5, 1420.7, 1459.1999999999998, 1490.0, 4.552904753232562, 3.539172054270625, 1.9918958295392462], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice", 100, 0, 0.0, 1211.6400000000006, 25, 7186, 441.0, 3176.400000000002, 7137.549999999996, 7185.98, 4.885197850512945, 10.512239710552027, 2.32571675012213], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice", 50, 0, 0.0, 1342.0, 29, 5206, 493.0, 4920.5, 4947.7, 5206.0, 2.271694684234439, 0.6721909075420263, 1.0914783053157655], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 100, 0, 0.0, 161.28, 1, 1752, 11.5, 764.9000000000002, 1074.8499999999983, 1751.97, 0.6053415336933097, 0.14956192189883533, 0.26897499788130463], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 50, 13, 26.0, 9505.46, 15, 33736, 2179.0, 31338.6, 32223.099999999995, 33736.0, 0.6261740763932373, 0.7557382983719475, 0.314921532561052], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 23, 100.0, 1.2105263157894737], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1900, 23, "500/Internal Server Error", 23, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 50, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 50, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid", 50, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv", 50, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 50, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 50, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 50, 13, "500/Internal Server Error", 13, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
