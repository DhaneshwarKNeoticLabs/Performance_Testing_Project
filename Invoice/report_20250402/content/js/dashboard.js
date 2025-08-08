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

    var data = {"OkPercent": 97.89473684210526, "KoPercent": 2.1052631578947367};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.915, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice"], "isController": false}, {"data": [0.6, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice"], "isController": false}, {"data": [0.5, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO"], "isController": false}, {"data": [0.0, 500, 1500, "Manage Invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1"], "isController": false}, {"data": [1.0, 500, 1500, "Add invoice"], "isController": true}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190, 4, 2.1052631578947367, 172.42631578947365, 2, 4309, 8.0, 713.0000000000015, 976.8, 3912.2400000000016, 2.005827456610785, 9.97655854113002, 1.2499822675615473], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceLotQtyIsValid", 5, 0, 0.0, 796.0, 739, 919, 763.0, 919.0, 919.0, 919.0, 0.5557408024897188, 0.17366900077803712, 0.4075794362009559], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenerateEInvoice", 5, 0, 0.0, 59.6, 43, 114, 46.0, 114.0, 114.0, 114.0, 0.616294835449279, 0.1793514267225441, 2.182911492357944], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoListForInvoice", 5, 0, 0.0, 829.6, 479, 961, 904.0, 961.0, 961.0, 961.0, 0.5749108888122341, 0.37447808870875016, 0.280156771012993], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoDetailsinv", 5, 0, 0.0, 990.6, 975, 1017, 989.0, 1017.0, 1017.0, 1017.0, 0.544425087108014, 2.3972780446972997, 0.2663642271885889], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSORemainingQty", 5, 0, 0.0, 12.6, 10, 16, 11.0, 16.0, 16.0, 16.0, 0.6185822095756526, 0.19632736143758506, 0.41017316435729306], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetInvoicetype", 15, 0, 0.0, 11.866666666666669, 4, 83, 5.0, 42.800000000000026, 83.0, 83.0, 0.16591085056962726, 0.08765407242008627, 0.06945356570069683], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/InvoiceJWLotQtyIsValid", 5, 0, 0.0, 63.0, 47, 95, 56.0, 95.0, 95.0, 95.0, 0.6155361319709467, 0.1532829234888588, 0.28071813831096887], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetPlant", 5, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.642756138321121, 0.1588059599562926, 0.285599651304795], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemDetailsinv", 5, 0, 0.0, 11.0, 7, 14, 11.0, 14.0, 14.0, 14.0, 0.6079766536964981, 4.417924101714494, 0.2909263284289883], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetOpenSOList", 5, 0, 0.0, 12.0, 9, 21, 10.0, 21.0, 21.0, 21.0, 0.6079766536964981, 0.15140043622324903, 0.30695696285262647], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetCities", 5, 0, 0.0, 2.8, 2, 3, 3.0, 3.0, 3.0, 3.0, 0.6085686465433301, 0.15035924567916262, 0.265654477543817], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 5, 4, 80.0, 3544.2, 2880, 4309, 3361.0, 4309.0, 4309.0, 4309.0, 0.0794419993962408, 0.24996300981903113, 0.04197082194664675], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetRunIRNVal", 5, 0, 0.0, 11.6, 5, 21, 10.0, 21.0, 21.0, 21.0, 0.08526166805927392, 0.02264763057824463, 0.033388602433368005], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-1", 5, 0, 0.0, 9.0, 7, 14, 8.0, 14.0, 14.0, 14.0, 0.6406970784213224, 25.56531506278831, 0.23463027774218348], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice", 5, 0, 0.0, 13.2, 10, 20, 12.0, 20.0, 20.0, 20.0, 0.6402048655569782, 25.80075624199744, 0.510163252240717], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice?InvoiceTypeId=1&InvoiceNo=NA&Handle=AddInvoice-0", 5, 0, 0.0, 3.6, 3, 5, 3.0, 5.0, 5.0, 5.0, 0.6409434687860531, 0.25537591334444304, 0.27603131810024356], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice", 5, 0, 0.0, 12.0, 11, 13, 12.0, 13.0, 13.0, 13.0, 0.08525730655117143, 3.4286092615012107, 0.07251866602155305], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetAllDropDownsForSO", 5, 0, 0.0, 2.6, 2, 3, 3.0, 3.0, 3.0, 3.0, 0.6429214350006429, 0.1588467998585573, 0.23104989070335605], "isController": false}, {"data": ["Manage Invoice", 5, 4, 80.0, 6464.0, 5787, 7266, 6400.0, 7266.0, 7266.0, 7266.0, 0.33246891415652635, 21.64586917763814, 5.94320651722189], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/sales/GetSoItemCount", 5, 0, 0.0, 7.0, 5, 10, 6.0, 10.0, 10.0, 10.0, 0.6082725060827251, 0.16216640054744524, 0.2970080596107056], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetPlant", 10, 0, 0.0, 4.6, 2, 12, 3.0, 11.600000000000001, 12.0, 12.0, 0.11078491109510885, 0.02737166260455326, 0.049117528942558025], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetJsonData", 5, 0, 0.0, 4.8, 3, 12, 3.0, 12.0, 12.0, 12.0, 0.6193484454354019, 0.15302261396011396, 0.28548092406788056], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Master/GetPageAccessDetails", 15, 0, 0.0, 3.066666666666667, 2, 6, 3.0, 5.4, 6.0, 6.0, 0.16618841334382164, 0.0430077436876101, 0.06832550978295793], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Store/GetPlant", 5, 0, 0.0, 5.8, 2, 11, 6.0, 11.0, 11.0, 11.0, 0.08526603001364257, 0.021066704681105046, 0.02964326824693042], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/ManageInvoice", 5, 0, 0.0, 11.6, 9, 16, 11.0, 16.0, 16.0, 16.0, 0.6186587478346943, 0.15285221015837663, 1.8167059128309824], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-0", 5, 0, 0.0, 5.0, 4, 6, 5.0, 6.0, 6.0, 6.0, 0.08526748409761421, 0.03397376319514316, 0.03697144818294991], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/SALES/ListInvoice-1", 5, 0, 0.0, 6.6, 6, 7, 7.0, 7.0, 7.0, 7.0, 0.08526603001364257, 3.3949868903478855, 0.03555526837482947], "isController": false}, {"data": ["Add invoice", 5, 0, 0.0, 64.0, 40, 133, 49.0, 133.0, 133.0, 133.0, 0.6218132073125233, 26.975398543402562, 2.585018382352941], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetTransportMode", 5, 0, 0.0, 6.0, 4, 10, 5.0, 10.0, 10.0, 10.0, 0.6424257998201208, 0.499385680328922, 0.2810612874213028], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustomerForInvoice", 10, 0, 0.0, 21.799999999999997, 14, 37, 21.5, 35.900000000000006, 37.0, 37.0, 1.278281989006775, 2.750678088648856, 0.6085570992585965], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetSoTypeListForInvoice", 5, 0, 0.0, 16.4, 11, 20, 19.0, 20.0, 20.0, 20.0, 0.6406149903907751, 0.1895569746957079, 0.30779548366431775], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 10, 0, 0.0, 4.199999999999999, 2, 14, 2.5, 13.400000000000002, 14.0, 14.0, 0.10574177857671566, 0.026125654277254946, 0.04698487231680237], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GetCustDispatchSchedule", 5, 0, 0.0, 6.6, 6, 7, 7.0, 7.0, 7.0, 7.0, 0.6099048548426446, 0.21025040406196632, 0.3067392580507441], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,873 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 25.0, 0.5263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,298 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 25.0, 0.5263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 3,361 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 25.0, 0.5263157894736842], "isController": false}, {"data": ["The operation lasted too long: It took 4,309 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 25.0, 0.5263157894736842], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 190, 4, "The operation lasted too long: It took 3,873 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,298 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,361 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,309 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Sales/GenInvoiceList", 5, 4, "The operation lasted too long: It took 3,873 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,298 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,361 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,309 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
