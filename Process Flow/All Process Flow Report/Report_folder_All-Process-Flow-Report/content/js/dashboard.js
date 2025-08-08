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

    var data = {"OkPercent": 94.92063492063492, "KoPercent": 5.079365079365079};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7528125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.84, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-34"], "isController": false}, {"data": [0.86, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-35"], "isController": false}, {"data": [0.88, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-32"], "isController": false}, {"data": [0.78, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-33"], "isController": false}, {"data": [0.91, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-30"], "isController": false}, {"data": [0.88, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-31"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.86, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-38"], "isController": false}, {"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-39"], "isController": false}, {"data": [0.91, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-36"], "isController": false}, {"data": [0.79, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-37"], "isController": false}, {"data": [0.3, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-23"], "isController": false}, {"data": [0.85, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-24"], "isController": false}, {"data": [0.85, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-21"], "isController": false}, {"data": [0.81, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-22"], "isController": false}, {"data": [0.93, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-20"], "isController": false}, {"data": [0.82, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu"], "isController": false}, {"data": [0.92, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-29"], "isController": false}, {"data": [0.61, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-27"], "isController": false}, {"data": [0.92, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-28"], "isController": false}, {"data": [0.45, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-25"], "isController": false}, {"data": [0.73, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-26"], "isController": false}, {"data": [0.95, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-12"], "isController": false}, {"data": [0.79, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-56"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-13"], "isController": false}, {"data": [0.87, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-57"], "isController": false}, {"data": [0.92, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-10"], "isController": false}, {"data": [0.95, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-54"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-11"], "isController": false}, {"data": [0.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-55"], "isController": false}, {"data": [0.98, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-52"], "isController": false}, {"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-53"], "isController": false}, {"data": [0.99, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-50"], "isController": false}, {"data": [0.97, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-51"], "isController": false}, {"data": [0.76, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-18"], "isController": false}, {"data": [0.93, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-19"], "isController": false}, {"data": [0.8, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-16"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-17"], "isController": false}, {"data": [0.67, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-14"], "isController": false}, {"data": [0.83, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-58"], "isController": false}, {"data": [0.88, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-15"], "isController": false}, {"data": [0.82, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-59"], "isController": false}, {"data": [0.95, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-45"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-46"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-43"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-44"], "isController": false}, {"data": [0.95, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-41"], "isController": false}, {"data": [0.93, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-42"], "isController": false}, {"data": [0.96, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-40"], "isController": false}, {"data": [0.93, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-0"], "isController": false}, {"data": [0.08, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-4"], "isController": false}, {"data": [0.17, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-3"], "isController": false}, {"data": [0.83, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-2"], "isController": false}, {"data": [0.54, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-1"], "isController": false}, {"data": [0.38, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-8"], "isController": false}, {"data": [0.06, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-7"], "isController": false}, {"data": [0.1, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-6"], "isController": false}, {"data": [0.09, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-5"], "isController": false}, {"data": [0.91, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-49"], "isController": false}, {"data": [0.94, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-47"], "isController": false}, {"data": [0.91, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-9"], "isController": false}, {"data": [0.9, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-48"], "isController": false}, {"data": [1.0, 500, 1500, "http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3150, 160, 5.079365079365079, 894.5644444444424, 0, 14035, 254.0, 2239.000000000002, 5111.149999999995, 9790.049999999968, 209.97200373283562, 13421.935018039261, 183.60247279529395], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-34", 50, 4, 8.0, 457.0999999999999, 5, 3014, 240.5, 1219.1, 1940.2499999999939, 3014.0, 5.034232782923882, 112.94999354988924, 2.193627605215465], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-35", 50, 2, 4.0, 473.1, 4, 4000, 263.0, 1118.1999999999994, 2338.7999999999947, 4000.0, 5.107252298263534, 132.92940819713996, 2.2982635342185906], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-32", 50, 2, 4.0, 314.32000000000005, 2, 1132, 224.0, 878.0999999999999, 1112.8, 1132.0, 6.251562890722681, 38.60852908539635, 2.7956207801950486], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-33", 50, 1, 2.0, 550.2600000000002, 4, 3333, 332.5, 1122.4999999999998, 2105.6499999999996, 3333.0, 6.292474200855777, 205.5397369745784, 2.980936752768689], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-30", 50, 0, 0.0, 421.02000000000004, 7, 3397, 259.5, 993.5999999999998, 1397.0499999999986, 3397.0, 6.104260774020267, 99.99303732755462, 2.956751312416066], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-31", 50, 2, 4.0, 433.26000000000005, 3, 5237, 261.5, 887.5999999999996, 1318.3999999999999, 5237.0, 6.217358865953742, 88.00598615083312, 2.902729420542154], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport", 50, 50, 100.0, 9780.160000000003, 5898, 14035, 9791.5, 11810.4, 12441.249999999995, 14035.0, 3.350308228357009, 6745.189952006835, 90.86107894582553], "isController": false}, {"data": ["Test", 50, 50, 100.0, 10579.699999999999, 7474, 14916, 10355.5, 12266.1, 13874.299999999997, 14916.0, 3.2821320729946173, 6609.600518371734, 91.79424673017593], "isController": true}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-38", 50, 2, 4.0, 302.02000000000004, 2, 1193, 203.5, 721.2999999999998, 1035.2499999999995, 1193.0, 6.650704974727321, 22.873489042963556, 3.1362230646448523], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-39", 50, 0, 0.0, 277.93999999999994, 1, 3007, 203.5, 410.2, 518.5999999999997, 3007.0, 5.4288816503800215, 9.166539427252985, 2.497073493485342], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-36", 50, 2, 4.0, 286.04000000000013, 3, 3004, 201.0, 479.8999999999999, 710.9999999999994, 3004.0, 5.175983436853002, 10.197698304865424, 2.3631599378881987], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-37", 50, 4, 8.0, 404.72, 3, 1712, 242.5, 943.9, 1278.3499999999983, 1712.0, 6.644518272425249, 106.51409364617939, 2.9490240863787376], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-23", 50, 2, 4.0, 2254.14, 59, 6794, 1662.5, 5555.099999999999, 5916.549999999998, 6794.0, 5.512071436445816, 1064.9302636837174, 2.304734869363907], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-24", 50, 1, 2.0, 458.4399999999999, 22, 1415, 272.5, 1034.7999999999997, 1361.95, 1415.0, 5.601613264620211, 55.00073083548062, 2.717985904940623], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-21", 50, 0, 0.0, 524.6199999999999, 15, 5006, 263.0, 968.7, 2370.449999999989, 5006.0, 4.988028731045491, 38.15549711941341, 2.3819785639465287], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-22", 50, 0, 0.0, 513.6, 46, 1905, 331.5, 1055.3999999999999, 1530.2999999999995, 1905.0, 5.492091388400703, 74.32558834028998, 2.4671504283831287], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-20", 50, 0, 0.0, 281.5600000000001, 100, 1241, 144.5, 749.1999999999999, 1199.4499999999998, 1241.0, 5.422405379026136, 90.76174628565231, 2.1446036899468606], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Home/GetQuickMenu", 50, 0, 0.0, 687.1999999999999, 9, 3461, 239.0, 3351.0, 3400.75, 3461.0, 8.171269815329303, 2.1385745219807157, 3.2956390954404315], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-29", 50, 1, 2.0, 314.5800000000001, 6, 1407, 251.5, 769.1999999999999, 1039.4999999999998, 1407.0, 5.9844404548174746, 17.700619015559543, 2.8292844853381207], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-27", 50, 1, 2.0, 1075.1000000000001, 24, 7338, 541.0, 2571.099999999999, 4182.7, 7338.0, 5.831583858175881, 283.8936893150805, 2.706788874795895], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-28", 50, 1, 2.0, 331.42, 4, 1500, 264.0, 588.9, 1208.6999999999991, 1500.0, 5.913660555884093, 34.237900096096986, 2.756204723536369], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-25", 50, 2, 4.0, 1058.94, 47, 3555, 913.0, 2175.2999999999997, 2674.549999999998, 3555.0, 5.577244841048522, 454.9219185722253, 2.504531511433352], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-26", 50, 3, 6.0, 779.36, 17, 5447, 334.0, 1816.4999999999995, 3487.849999999995, 5447.0, 5.827505827505828, 104.81873269959208, 2.5998415646853146], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-12", 50, 0, 0.0, 250.17999999999998, 22, 1107, 234.5, 496.4999999999999, 633.4999999999992, 1107.0, 5.469861065528936, 13.89366077289137, 2.6067306640411334], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-56", 50, 4, 8.0, 365.9800000000001, 9, 2413, 243.5, 746.2, 903.8499999999988, 2413.0, 8.448800270361609, 163.5166282950321, 3.4841400177424804], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-13", 50, 1, 2.0, 529.6800000000002, 56, 7742, 224.0, 686.5999999999999, 3455.3999999999987, 7742.0, 5.549389567147614, 15.16771729328524, 2.612982103218646], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-57", 50, 3, 6.0, 245.23999999999998, 9, 1059, 214.5, 626.6, 680.6999999999999, 1059.0, 8.28363154406892, 31.51193748964546, 3.444664046968191], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-10", 50, 1, 2.0, 454.64000000000004, 41, 6304, 219.5, 436.3999999999999, 3321.9, 6304.0, 5.393743257820928, 5.670804679072276, 2.5087226941747574], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-54", 50, 0, 0.0, 265.84000000000003, 5, 3005, 205.5, 327.4, 851.0999999999992, 3005.0, 5.739210284664829, 17.91821804694674, 2.6734407283057853], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-11", 50, 0, 0.0, 300.6199999999999, 59, 1430, 240.0, 661.1999999999999, 822.9999999999993, 1430.0, 5.302226935312832, 37.819790562036054, 2.500952743902439], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-55", 50, 50, 100.0, 191.53999999999994, 13, 529, 192.0, 394.19999999999993, 446.7999999999999, 529.0, 8.470269354565476, 12.012231598339827, 3.5972175165170257], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-52", 50, 0, 0.0, 188.51999999999998, 1, 714, 182.0, 295.9, 563.2999999999994, 714.0, 8.118201006656925, 13.295139734534828, 3.7895508605293067], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-53", 50, 1, 2.0, 177.49999999999997, 5, 708, 187.5, 290.0, 383.5499999999993, 708.0, 8.237232289950576, 13.145947024299835, 3.839161604200988], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-50", 50, 0, 0.0, 192.10000000000002, 1, 1001, 187.5, 293.9, 382.9999999999999, 1001.0, 7.861635220125786, 12.091870577830187, 3.6928188875786163], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-51", 50, 0, 0.0, 210.59999999999997, 0, 889, 199.5, 398.9, 506.79999999999995, 889.0, 8.058017727639, 18.335137993553584, 3.769326651893634], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-18", 50, 1, 2.0, 604.8600000000001, 82, 3085, 426.0, 1311.8, 2144.549999999999, 3085.0, 4.076308495026904, 115.38341502934942, 1.9388738433474646], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-19", 50, 0, 0.0, 320.82, 24, 1421, 247.5, 686.9999999999999, 1007.7999999999987, 1421.0, 5.4019014693172, 15.224499648876405, 2.579618963375108], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-16", 50, 0, 0.0, 643.8, 46, 4025, 270.0, 1449.4999999999993, 3995.85, 4025.0, 5.438329345225147, 90.72025573743745, 2.421756036545573], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-17", 50, 0, 0.0, 304.58, 32, 3467, 210.0, 500.4, 724.6499999999984, 3467.0, 5.238893545683152, 3.760338628981559, 2.404570279756915], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-14", 50, 0, 0.0, 860.0399999999998, 68, 4269, 562.0, 2144.7999999999993, 3486.549999999994, 4269.0, 5.457919441109049, 171.60999242713677, 2.6116997325619473], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-58", 50, 4, 8.0, 340.9199999999999, 8, 1265, 227.5, 1043.0, 1132.6999999999998, 1265.0, 8.509189925119129, 110.50778590878147, 3.4096589942137507], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-15", 50, 1, 2.0, 379.31999999999994, 51, 3244, 235.5, 690.5, 1372.7499999999973, 3244.0, 5.4626898284715395, 17.73709780946138, 2.4989672102043046], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-59", 50, 3, 6.0, 330.21999999999997, 7, 933, 271.5, 778.4, 884.0999999999998, 933.0, 8.882572392965002, 161.15796822259728, 3.701881439864985], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-45", 50, 1, 2.0, 224.65999999999997, 2, 1349, 195.5, 449.09999999999985, 596.9999999999995, 1349.0, 7.452675510508272, 20.997476570651365, 3.366513265762409], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-46", 50, 1, 2.0, 245.01999999999987, 4, 1247, 210.5, 583.6999999999998, 652.0999999999999, 1247.0, 7.506380423359856, 22.707680434619427, 3.3835889412250415], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-43", 50, 1, 2.0, 248.22000000000003, 2, 863, 222.5, 624.5999999999997, 771.8499999999999, 863.0, 7.172572084349448, 37.77423881078755, 3.226256544972027], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-44", 50, 1, 2.0, 247.71999999999997, 1, 1345, 201.0, 349.29999999999995, 989.5999999999981, 1345.0, 7.4537865235539655, 21.605499031007753, 3.3527481179189027], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-41", 50, 1, 2.0, 239.72000000000003, 1, 1247, 202.0, 446.9, 785.6499999999994, 1247.0, 7.158196134574087, 13.399388197924123, 3.1923877057981387], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-42", 50, 1, 2.0, 234.24000000000004, 0, 859, 203.5, 683.2999999999997, 788.7499999999999, 859.0, 7.1705148429657255, 11.672533791051197, 3.2116063745876953], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-40", 50, 0, 0.0, 237.0, 1, 1007, 206.0, 351.79999999999995, 854.2999999999995, 1007.0, 6.968641114982578, 21.232578397212546, 3.1848867595818815], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-0", 50, 0, 0.0, 208.51999999999995, 3, 1067, 102.5, 903.1999999999994, 978.6999999999999, 1067.0, 8.095854922279791, 3.2256921955958546, 3.2494105205634716], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-4", 50, 0, 0.0, 4030.360000000001, 602, 9373, 4180.0, 7047.7, 8137.0, 9373.0, 4.147312541473125, 1047.4758743053253, 1.9157019844890513], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-3", 50, 1, 2.0, 3419.12, 56, 9318, 3060.5, 6686.599999999999, 7964.85, 9318.0, 4.3353854157634615, 691.5088767016388, 1.962523980100581], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-2", 50, 0, 0.0, 535.1200000000002, 22, 3463, 244.0, 1070.1999999999994, 3330.3999999999996, 3463.0, 5.877512636652169, 8.035661807922887, 2.5943708122722464], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-1", 50, 0, 0.0, 1322.2800000000002, 8, 6622, 766.0, 3403.0, 4757.999999999997, 6622.0, 5.808550185873606, 231.774766205855, 2.1271546090845725], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-8", 50, 1, 2.0, 1585.0999999999997, 168, 6633, 1089.0, 3327.5, 3687.4499999999975, 6633.0, 4.837461300309598, 203.2475427208301, 2.259245597910217], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-7", 50, 0, 0.0, 4711.8600000000015, 878, 10026, 4953.0, 8717.6, 9909.949999999999, 10026.0, 4.270949004868882, 1149.369100751687, 1.8768818869052701], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-6", 50, 0, 0.0, 4113.900000000001, 191, 10300, 3676.0, 8024.9, 9763.3, 10300.0, 4.250255015300918, 1089.4100911679702, 1.9134448848180892], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-5", 50, 0, 0.0, 4381.52, 602, 10758, 4949.0, 7812.299999999998, 8588.549999999996, 10758.0, 4.129501156260324, 1042.9772993578624, 1.9357036669970267], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-49", 50, 0, 0.0, 359.84, 1, 3286, 217.0, 630.2999999999998, 2298.149999999994, 3286.0, 5.446623093681917, 43.61553649237473, 2.44140625], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-47", 50, 0, 0.0, 257.1200000000001, 1, 1215, 229.5, 644.6999999999999, 823.3499999999995, 1215.0, 7.590708972218006, 33.33536938287536, 3.521080822073782], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-9", 50, 0, 0.0, 286.4599999999999, 23, 1210, 223.0, 687.4, 771.5499999999997, 1210.0, 5.231219920485457, 19.060235862628165, 2.513437696170747], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-48", 50, 3, 6.0, 221.5400000000001, 1, 1075, 195.5, 428.09999999999997, 597.1499999999997, 1075.0, 7.530120481927711, 11.436664627259036, 3.2211855233433737], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Notification/Getnotitfication", 50, 0, 0.0, 112.34000000000003, 2, 472, 81.0, 265.8, 329.34999999999957, 472.0, 8.668515950069347, 2.1417329446948683, 3.851733161407767], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 53, 33.125, 1.6825396825396826], "isController": false}, {"data": ["404/Not Found", 48, 30.0, 1.5238095238095237], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 9, 5.625, 0.2857142857142857], "isController": false}, {"data": ["Assertion failed", 50, 31.25, 1.5873015873015872], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3150, 160, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 53, "Assertion failed", 50, "404/Not Found", 48, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 9, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-34", 50, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-35", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-32", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-33", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-31", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport", 50, 50, "Assertion failed", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-38", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-36", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-37", 50, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-23", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-24", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-29", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-27", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-28", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-25", 50, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-26", 50, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-56", 50, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-13", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-57", 50, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-10", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-55", 50, 50, "404/Not Found", 48, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-53", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-18", 50, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-58", 50, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-15", 50, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-59", 50, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-45", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-46", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-43", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-44", 50, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-41", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-42", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-3", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-8", 50, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://192.168.2.5/ACCSSPLDRYRUN/Production/PrintAllProcessFlowReport-48", 50, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Connection is closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
