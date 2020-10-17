var count = 10;

for (i = 1; i <= count; i++) {

    $('#color1').append($('#color-div-box').clone().addClass( "brown_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color2').append($('#color-div-box').clone().addClass( "brown_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color3').append($('#color-div-box').clone().addClass( "purple_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color4').append($('#color-div-box').clone().addClass( "purple_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color5').append($('#color-div-box').clone().addClass( "blue_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color6').append($('#color-div-box').clone().addClass( "blue_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color7').append($('#color-div-box').clone().addClass( "green_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color8').append($('#color-div-box').clone().addClass( "green_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color9').append($('#color-div-box').clone().addClass( "green_v3_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color10').append($('#color-div-box').clone().addClass( "green_v4_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color11').append($('#color-div-box').clone().addClass( "yellow_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color12').append($('#color-div-box').clone().addClass( "yellow_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color13').append($('#color-div-box').clone().addClass( "orange_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color14').append($('#color-div-box').clone().addClass( "orange_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color15').append($('#color-div-box').clone().addClass( "gray_v1_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color16').append($('#color-div-box').clone().addClass( "gray_v2_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color17').append($('#color-div-box').clone().addClass( "gray_v3_" + i + "0" ));
    $( "#color-div-box" );

}

for (i = 1; i <= count; i++) {

    $('#color18').append($('#color-div-box').clone().addClass( "gray_v4_" + i + "0" ));
    $( "#color-div-box" );

}

$(".colors-container>div").click(function() {
    $(".color-box>i").hide();
    $(".colors-container>div ").css("border", "none");
    var colorID = this.id;

    if (colorID == "color1") {
        $(".brown_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#631e16");
        $("#color1").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color2") {
        $(".brown_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#782920");
        $("#color2").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color3") {
        $(".purple_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#522d60");
        $("#color3").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color4") {
        $(".purple_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#4a235a");
        $("#color4").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color5") {
        $(".blue_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#164360");
        $("#color5").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color6") {
        $(".blue_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#1a4f71");
        $("#color6").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color7") {
        $(".green_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#0e6252");
        $("#color7").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color8") {
        $(".green_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#0c5346");
        $("#color8").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color9") {
        $(".green_v3_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#145b33");
        $("#color9").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color10") {
        $(".green_v4_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#186a3a");
        $("#color10").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color11") {
        $(".yellow_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#7d6608");
        $("#color11").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color12") {
        $(".yellow_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#7d5108");
        $("#color12").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color13") {
        $(".orange_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#784213");
        $("#color13").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color14") {
        $(".orange_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#6f2c01");
        $("#color14").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color15") {
        $(".gray_v1_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#4d5557");
        $("#color15").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color16") {
        $(".gray_v2_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#424b4a");
        $("#color16").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color17") {
        $(".gray_v3_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#1c2630");
        $("#color17").css("border", "2px solid #c5c5c5");
    }

    if (colorID == "color18") {
        $(".gray_v4_100>i").show();
        $('#color_palette_popup').modal('toggle');
        $("#color-holder").css('background-color', "#171f2a");
        $("#color18").css("border", "2px solid #c5c5c5");
    }
 });
