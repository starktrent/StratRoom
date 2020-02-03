'use strict';
var class1, fill, empty, color;
$(document).ready(function() {
    initCardChart();
    // chart7();
    // updateChart(fill="35", empty="65", color="red");
});

function initCardChart() {

    //Chart Pie
    $('.chart_yellow.chart-pie').sparkline([50, 50], {
        type: 'pie',
        height: '30px',
        sliceColors: ['#ffd500', '#ffffff']
    });

    $('.chart_green.chart-pie').sparkline([85, 15], {
        type: 'pie',
        height: '30px',
        sliceColors: ['#1aa243', '#ffffff']
    });

    $('.chart_orange.chart-pie').sparkline([25, 75], {
        type: 'pie',
        height: '30px',
        sliceColors: ['#e84343', '#ffffff']
    });

}

function updateChart(id, fill, empty, color) {
    $('#' + id).sparkline([fill, empty], {
        type: 'pie',
        tooltipFormat: '{{offset:offset}} ({{percent}}%)',
        tooltipValueLookups: {
            'offset': {
                0: fill,
                1: empty,
            }
        },
        height: '30px',
        sliceColors: [color, '#ffffff']
    });

    $('.chart-pie').children(':first-child').css('border', '1px solid #c7c7c7').css('border-radius', '50%');
}

$(function() {
    $('#chat_user').slimscroll({
        height: '590px',
        size: '3px',
        color: '#9c9c9c'
    });
});

$(function() {
    $('#initiate_sidebar, #risk_sidebar').slimscroll({
        height: '597px',
        size: '3px',
        color: '#9c9c9c'
    });
});

$(function() {
    // $('#comment-conversation').slimscroll({
    //     height: '267px',
    //     size: '3px'
    // });

    $('#sub-ini-box_view, #activities-box_view, #milestone_view, #plan_box_views, #activities-box_risk_view, #monitoring-box_risk_view, #my_initative_view, #goals_box_view, #my_kpi_view').slimscroll({
        height: '450px',
        size: '3px',
        color: '#9c9c9c'
    });

    $('#comment-conversation, #comment-conversation_employee').slimscroll({
        height: '282px',
        size: '3px',
        color: '#9c9c9c'
    });

    $('.employee_div_body_box, .milestones-box, .sub-ini-box, .activities-box').slimscroll({
        height: '340px',
        size: '3px',
        color: '#9c9c9c'
    });


    $('.chart-pie').children(':first-child').css('border', '1px solid #c7c7c7').css('border-radius', '50%');
});

//editable fields
jQueryEditable($(".editableTxt"));
jQueryEditable($(".editableTxt1"));

//Gantt Chart
am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv_init", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingRight = 0;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    chart.data = [{
        "category": "Project 01",
        "start": "2019-03-01",
        "end": "2019-06-14",
        "color": colorSet.getIndex(0).brighten(0),
    }, {
        "category": "Project 02",
        "start": "2019-04-08",
        "end": "2019-07-10",
        "color": colorSet.getIndex(2).brighten(0),
    }, {
        "category": "Project 03",
        "start": "2019-05-02",
        "end": "2019-07-08",
        "color": colorSet.getIndex(4).brighten(0),
    }, {
        "category": "Project 04",
        "start": "2019-03-01",
        "end": "2019-07-19",
        "color": colorSet.getIndex(6).brighten(0),
    }, {
        "category": "Project 05",
        "start": "2019-01-01",
        "end": "2019-01-20",
        "color": colorSet.getIndex(8).brighten(0),
    }];

    chart.dateFormatter.dateFormat = "yyyy-MM-dd";
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.baseInterval = {
        count: 1,
        timeUnit: "day"
    };

    dateAxis.renderer.tooltipLocation = 0;

    var series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(20);
    series1.columns.template.tooltipText = "{category}";

    series1.dataFields.openDateX = "start";
    series1.dataFields.dateX = "end";
    series1.dataFields.categoryY = "category";
    series1.columns.template.propertyFields.fill = "color"; // get color from data
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;

    // chart.scrollbarX = new am4core.Scrollbar();

    let cellSize = 55;
    chart.events.on("datavalidated", function(ev) {
        // Get objects of interest
        let chart = ev.target;
        let categoryAxis = chart.yAxes.getIndex(0);

        // Calculate how we need to adjust chart height
        let adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

        // get current chart height
        let targetHeight = chart.pixelHeight + adjustHeight;

        // Set it on chart's container
        chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });

}); // end am4core.ready()

$('g[stroke="#3cabff"]').parent().css('display', 'none');


/***********Pie chart ************ */

var data = [{
    label: "1",
    value: 1
}, {
    label: "2",
    value: 4
}, {
    label: "3",
    value: 3
}];

var pie;

var update = function() {
    if (pie) pie.destroy();
    var innerHeight = $('#chartdiv').innerHeight();
    var innerWidth = $('#chartdiv').innerWidth();
    var size = Math.min(innerHeight, innerWidth);
    var opt = {
        data: {
            content: data
        },
        size: {
            canvasHeight: size,
            canvasWidth: size,
        }
    };
    pie = new d3pie("chartdiv", opt);
};

update();

$("#chartdiv").resize(function(e) {
    update();
});

//editable fields
jQueryEditable($(".editableTxt1"));
$('.single_date_picker').datepicker({
    autoclose: true
});




/***************Heat map chart*****************/


//editable fields
jQueryEditable($(".editableTxt"));
jQueryEditable($(".editableTxt1"));
// $('.single_date_picker').datepicker({
//     autoclose: true
// });

// $('.date_pickers').daterangepicker({
//     timePicker: false,
//     autoApply: true,
//     startDate: moment().startOf('hour'),
//     endDate: moment().startOf('hour').add(48, 'hour'),
//     locale: {
//         format: 'MMM DD, YYYY'
//     }

// }).on('apply.daterangepicker', function(e, picker) {
//     var startDate = new Date();
//     var endDate = picker.endDate._d;
//     var oneDay = 24 * 60 * 60 * 1000;
//     var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
//     $('.diff').html(diffDays + ' Days');
// });

function draw(width, height) {
    // set the dimensions and margins of the graph
    var margin = {
        top: 10,
        right: 25,
        bottom: 30,
        left: 65
    };
    // width = 300 - margin.left - margin.right,
    // height = 350 - margin.top - margin.bottom;

    // width = $("#chartdiv").innerWidth() - 20;
    // height = $("#chartdiv").innerHeight() - 20;

    $('#chartdiv').empty();
    var chartDiv = document.getElementById("chartdiv");
    var svg = d3.select(chartDiv).append("svg");

    // append the svg object to the body of the page
    // var svg = d3.select("#chartdiv")
    //     .append("svg")
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("../../assets/heatmap_data.csv", function(data) {

        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var myGroups = d3.map(data, function(d) {
            return d.xaxis;
        }).keys()
        var myVars = d3.map(data, function(d) {
            return d.yaxis;
        }).keys()

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain(myGroups)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 11)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain(myVars)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 11)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([1, 100])

        // create a tooltip
        var tooltip = d3.select("#chartdiv")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function(d) {
            tooltip
                .html("The exact value of<br>this cell is: " + d.number)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg.selectAll()
            .data(data, function(d) {
                return d.xaxis + ':' + d.yaxis;
            })
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return x(d.xaxis)
            })
            .attr("y", function(d) {
                return y(d.yaxis)
            })
            .attr("rx", 3)
            .attr("ry", 2)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function(d) {
                return myColor(d.number)
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })


    // Add subtitle to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "11px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Risk Rating");

}
width1 = $("#chartdiv").innerWidth();
height1 = $("#chartdiv").innerHeight();
draw(width1, height1);

$("#chartdiv").resize(function(e) {

    width = $("#chartdiv").innerWidth();
    height = $("#chartdiv").innerHeight();
    draw(width, height);
    // append the svg object to the body of the page


    // width = $("#chartdiv").innerWidth();
    // height = $("#chartdiv").innerHeight();
    // svg
    //     .attr("width", '100%')
    //     .attr("height", '100%')
    //     .attr('viewBox', '0 0 ' + height + ' ' + width)
    //     .attr('preserveAspectRatio', 'xMinYMin')
    //     .append("g")
    //     .attr("transform", "translate(" + height + "," + width + ")");
});

$('g[stroke="#3cabff"]').parent().css('display', 'none');

//clone sub initiatives row
$(document).on("click", ".add-sub-initiative", function() {
    var cloned = $('#sub-ini-row').clone().show();
    $('.sub-ini-box').prepend(cloned);
    // $('.date_pickers').daterangepicker({
    //     timePicker: false,
    //     autoApply: true,
    //     startDate: moment().startOf('hour'),
    //     endDate: moment().startOf('hour').add(48, 'hour'),
    //     locale: {
    //         format: 'MMM DD, YYYY'
    //     }

    // }).on('apply.daterangepicker', function(e, picker) {
    //     var startDate = new Date();
    //     var endDate = picker.endDate._d;
    //     var oneDay = 24 * 60 * 60 * 1000;
    //     var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
    //     $('.diff').html(diffDays + ' Days');
    // });
});

//clone activities row
$(document).on("click", ".add-activities", function() {
    var cloned = $('#activities-row').clone().show();
    $('.activities-box').prepend(cloned);
    // $('.date_pickers').daterangepicker({
    //     timePicker: false,
    //     autoApply: true,
    //     startDate: moment().startOf('hour'),
    //     endDate: moment().startOf('hour').add(48, 'hour'),
    //     locale: {
    //         format: 'MMM DD, YYYY'
    //     }

    // }).on('apply.daterangepicker', function(e, picker) {
    //     var startDate = new Date();
    //     var endDate = picker.endDate._d;
    //     var oneDay = 24 * 60 * 60 * 1000;
    //     var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
    //     $('.diff').html(diffDays + ' Days');
    // });
});

//clone activities row
$(document).on("click", ".add-milestones", function() {
    var cloned = $('#milestones-row').clone().show();
    $('.milestones-box').prepend(cloned);
    // $('.date_pickers').daterangepicker({
    //     timePicker: false,
    //     autoApply: true,
    //     startDate: moment().startOf('hour'),
    //     endDate: moment().startOf('hour').add(48, 'hour'),
    //     locale: {
    //         format: 'MMM DD, YYYY'
    //     }

    // }).on('apply.daterangepicker', function(e, picker) {
    //     var startDate = new Date();
    //     var endDate = picker.endDate._d;
    //     var oneDay = 24 * 60 * 60 * 1000;
    //     var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
    //     $('.diff').html(diffDays + ' Days');
    // });
});

$(document).on("click", ".delete-row", function() {
    $(this).parent().parent().parent().parent().parent().parent().css('display', 'none !important');
});

//Fileupload function
$(function() {
    $("#upload_link").on('click', function(e) {
        e.preventDefault();
        $("#upload:hidden").trigger('click');
    });

    //data collection form image replace
    $("#upload_link1").on('click', function(e) {
        e.preventDefault();
        $("#upload1:hidden").trigger('click');
    });

    $("#upload1").change(readURL)

});

function readURL() {
    console.log(this);
    var input = this;
    console.log(input.files);
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#upload_link1').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// $("#send-btn").on('click', function(e) {
$('body').on('click', '#send-btn', function() {
    var parent = $("#comment-conversation");
    var value = $('#comment').val();
    console.log(parent);
    console.log(value);
    var timeNow = formatDate(new Date);
    var data = '<li><div class="d-flex flex-row"><div class="flex-column comment_image"><img src="../../images/user/usrbig6.jpg" class="rounded-circle" alt="User" width="40"></div><div class="flex-column comment_details"><ul><li><span class="message-data-name"><strong>Elmer Roberts, </strong></span></li><li>' + value + '</li><li><ul class="d-flex flex-row"><li class="reply">Reply</li><li>Like</li><li>' + timeNow + ', Today</li></ul></li></ul><ul><li><div class="comment_send" style="display:none"><div class="form-group d-flex flex-row align-items-center"><div class="form-line"><input type="text" class="form-control comment" placeholder="Type a comment..."></div><div class="send_btn reply-btn"><i class="fas fa-arrow-right"></i></div></div></div></li></ul></div><div class="flex-column"><ul class="header-dropdown m-r--2 pt-2 d-flex"><li class="dropdown"><a href="#" onclick="return false;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"><i class="material-icons">more_vert</i></a><ul class="dropdown-menu pull-right" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 24px, 0px);"><li><a href="#" data-toggle="modal" data-target=".sub_activitie_popup" onclick="return false;">Edit</a></li><li><a href="#" onclick="return false;">Delete</a></li></ul></li></ul></div></div></li>'
    parent.append(data);
    $('#comment').val('');
});

// $(".reply").on('click', function(e) {
$('body').on('click', '.reply', function() {
    $(this).parent().parent().parent().next().find('div.comment_send').toggle();
});

// $(".reply-btn").on('click', function(e) {
$('body').on('click', '.reply-btn', function() {
    var parent = $(this).parent().parent().parent().parent();
    var value = $(this).parent().find('input.comment').val();
    var timeNow = formatDate(new Date);
    var data = '<ul><li><div class="d-flex flex-row"><div class="flex-column comment_image"><img src="../../images/user/usrbig6.jpg" class="rounded-circle" alt="User" width="40"></div><div class="flex-column comment_details"><ul><li><span class="message-data-name"><strong>Elmer Roberts, </strong></span></li><li>' + value + '</li><li><ul class="d-flex flex-row"><li class="reply">Reply</li><li>Like</li><li>' + timeNow + ', Today</li></ul></li></ul><ul><li><div class="comment_send" style="display:none"><div class="form-group d-flex flex-row align-items-center"><div class="form-line"><input type="text" class="form-control comment" placeholder="Type a comment..."></div><div class="send_btn reply-btn"><i class="fas fa-arrow-right"></i></div></div></div></li></ul></div><div class="flex-column"><ul class="header-dropdown m-r--2 pt-2 d-flex"><li class="dropdown"><a href="#" onclick="return false;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"><i class="material-icons">more_vert</i></a><ul class="dropdown-menu pull-right" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 24px, 0px);"><li><a href="#" data-toggle="modal" data-target=".sub_activitie_popup" onclick="return false;">Edit</a></li><li><a href="#" onclick="return false;">Delete</a></li></ul></li></ul></div></div></li><ul>'
    parent.append(data);
    $(this).parent().parent().toggle();
    // $('.comment').val('');
});

$(window).on('load', function() {
    setTimeout(function() {
        var allGs = document.getElementsByTagName('g');
        var allText = document.getElementsByTagName('text');
        for (var i = 0; i < allGs.length; i++) {
            var gElem = allGs[i];
            if (gElem.getAttribute('filter') == 'url("#filter-id-66")') {
                gElem.remove();
            }
        }
    }, 1000);

});