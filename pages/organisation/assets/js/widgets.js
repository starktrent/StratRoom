$('.carousel').carousel();

// profile image upload
$('.editProfile').on('click', function() {
    $('.profile-default').css('display', 'none');
    $('.editProfile').css('display', 'none');
    $('.profile-replace').css('display', 'block');
});

$('.cancelEditProfile').on('click', function() {
    $('.profile-default').css('display', 'block');
    $('.editProfile').css('display', 'block');
    $('.profile-replace').css('display', 'none');
});

$("#profileImage").click(function(e) {
    $("#imageUpload").click();
});

// reporting Image Upload
$('#reportingAdd').on('click', function() {
    $('.reporting-default').css('display', 'none');
    $('#reportingAdd').css('display', 'none');
    $('.reporting-replace-add').css('display', 'block');
});

$('.canceladdReporting').on('click', function() {
    $('.reporting-default').css('display', 'block');
    $('#reportingAdd').css('display', 'block');
    $('.reporting-replace-add').css('display', 'none');
});

$("#reportingImage").click(function(e) {
    $("#reportingImageUpload").click();
});

// reporting Image Upload
$('.reportingEdit').on('click', function() {
    $('.reporting-default').css('display', 'none');
    $('#reportingAdd').css('display', 'none');
    $('.reporting-replace-add').css('display', 'block');
});

$('.canceladdReporting').on('click', function() {
    $('.reporting-default').css('display', 'block');
    $('#reportingAdd').css('display', 'block');
    $('.reporting-replace-add').css('display', 'none');
});

$("#reportingImage").click(function(e) {
    $("#reportingImageUpload").click();
});


$('#directAdd').on('click', function() {
    $('.direct-default').css('display', 'none');
    $('#directAdd').css('display', 'none');
    $('.direct-replace-add').css('display', 'block');
});

$('.canceladdReporting').on('click', function() {
    $('.direct-default').css('display', 'block');
    $('#directAdd').css('display', 'block');
    $('.direct-replace-add').css('display', 'none');
});

$("#directImage").click(function(e) {
    $("#directImageUpload").click();
});


// direct Image Upload
$('.directEdit').on('click', function() {
    $('.direct-default').css('display', 'none');
    $('#directAdd').css('display', 'none');
    $('.direct-replace-add').css('display', 'block');
});

$('.canceladdDirect').on('click', function() {
    $('.direct-default').css('display', 'block');
    $('#directAdd').css('display', 'block');
    $('.direct-replace-add').css('display', 'none');
});

$("#directImage").click(function(e) {
    $("#directImageUpload").click();
});

$(document).ready(function() {
    $('.editForm').on('click', function() {
        $('#formsidebar').toggleClass('open');
        $('#formsidebar').css('display', 'block');
        $('#formsidebar').css('right', '0px');
    });

    $('.scorecarddesc').on('click', function() {
        $('#scorecardsidebar').toggleClass('open');
        $('#scorecardsidebar').css('display', 'block');
        $('#scorecardsidebar').css('right', '0px');
    });

    $('.perspectivedesc').on('click', function() {
        $('#perspectivesidebar').toggleClass('open');
        $('#perspectivesidebar').css('display', 'block');
        $('#perspectivesidebar').css('right', '0px');
    });

    $('.objectivedesc').on('click', function() {
        $('#objectivesidebar').toggleClass('open');
        $('#objectivesidebar').css('display', 'block');
        $('#objectivesidebar').css('right', '0px');
    });

    $('.kpidesc').on('click', function() {
        $('#kpisidebar').toggleClass('open');
        $('#kpisidebar').css('display', 'block');
        $('#kpisidebar').css('right', '0px');
    });
});

$('.cancelEditScorecard').on('click', function() {
    $('#scorecardsidebar').css('display', 'none');
    $('.overlay').css('display', 'none');
});

$('.cancelEditPerspective').on('click', function() {
    $('#perspectivesidebar').css('display', 'none');
    $('.overlay').css('display', 'none');
});
$('.cancelEditObjective').on('click', function() {
    $('#objectivesidebar').css('display', 'none');
    $('.overlay').css('display', 'none');
});
$('.cancelEditKpi').on('click', function() {
    $('#kpisidebar').css('display', 'none');
    $('.overlay').css('display', 'none');
});

$('.checkbox').change(function() {
    $('.toggleDiv').toggle(this.checked);
    $('.btn-new-persp').toggle(this.checked);
}).change();

$('.switchTable').on('click', function() {
    $('.tableview').css('display', 'block');
    $('.tableview').css('display', '');
    $('.tileview').css('display', 'none');
    $('.switchTable').css('display', 'none');
    $('.switchTile').css('display', 'block');
});


$('.switchTile').on('click', function() {
    $('.tileview').css('display', 'block');
    $('.tileview').css('display', '');
    $('.tableview').css('display', 'none');
    $('.switchTile').css('display', 'none');
    $('.switchTable').css('display', 'block');
});

/*********POPUP***********/

$(function() {
    $('.js-modal-buttons .btn').on('click', function() {
        var color = $(this).data('color');
        $('#mdModal .modal-content').removeAttr('class').addClass('modal-content modal-col-' + color);
        $('#mdModal').modal('show');
    });
});

// $('.date_pickers').daterangepicker({
//     //drops: 'up',
//     opens: 'center',
//     timePicker: false,
//     autoApply: true,
//     startDate: moment().startOf('hour'),
//     endDate: moment().startOf('hour').add(48, 'hour'),
//     locale: {
//         format: 'MMM DD, YYYY'
//     }
// });          

$('#kpi_threshold').on('change', function() {
    $(this).val() == 'option_1' ? $('.color_picks_1').css('display', 'block') : $('.color_picks_1').css('display', 'none');
    $(this).val() == 'option_2' ? $('.color_picks_2').css('display', 'block') : $('.color_picks_2').css('display', 'none');
    $(this).val() == 'option_3' ? $('.color_picks_3').css('display', 'block') : $('.color_picks_3').css('display', 'none');
});

const inputElements = document.querySelectorAll('.pickr');
inputElements.forEach((inputElement) => {
    const pickr = new Pickr({
        el: inputElement,
        useAsButton: true,
        theme: 'classic',

        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],

        components: {
            preview: true,
            opacity: true,
            hue: true,

            interaction: {
                hex: true,
                rgba: true,
                hsva: true,
                input: true,
                save: true
            }
        }
    }).on('save', color => {

        inputElement.style.background = color.toRGBA().toString(0);

        pickr.hide();
    })
});


$('.date_pickers').datepicker({
    language: 'en',
    minDate: new Date(),
    range: true,
    autoClose: true,
    position: "top left",
    todayButton: true,
    onSelect: function(fd) {
        // $('.datepickers-container').hide();
    }
});

$('.date_pickers_single').datepicker({
    language: 'en',
    minDate: new Date(),
    autoClose: true,
    position: "top left",
    todayButton: true,
    onSelect: function(fd) {
        // $('.datepickers-container').hide();
    }
});


$('#kpi_formula').on('click', function() {
    $("#kpi_trigger").trigger("click");
});

$(".list-group-item, .opr").click(function() {
    var box = $("#formula");
    box.val(box.val() + $(this).text());
});

$("#add").click(function() {
    var value = $("#formula").val();
    var ul = $(".formula-panel");
    var li = document.createElement("li");
    li.setAttribute("class", "list-group-item");
    li.appendChild(document.createTextNode(value));
    ul.append(li);
    $("#formula").val('');
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

    $("#upload1").change(readURL);

    $("#upload_link2").on('click', function(e) {
        e.preventDefault();
        $("#upload2:hidden").trigger('click');
    });

    $("#upload2").change(readURL);

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


    // KPI file Js


    $(function() {
        $("#dialog").dialog({
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 100
            },
            hide: {
                effect: "blind",
                duration: 100
            }
        });

        $(".choose").on("click", function() {
            $("#dialog").dialog("option", "position", { my: "center bottom+96", at: "center bottom+50", of: $(this) });
            $("#dialog").dialog("open");
        });
        $("#dialog").dialog({
            height: 'auto',
            modal: true,
            fluid: true, //new option
            resizable: false,
            width: 500,
            // autoOpen: true,
            //dialogClass: "test",
            top: 274,
            left: 490,
            modal: true,
            responsive: true
        });
        $("#dialog").dialog("widget").position({
            my: 'left+100',
            at: 'right+100',
           // of: target
         });

        $("#main-select").on("change", function() {
            var value = $(this).val();
            switch (value) {
                case 'last-n-days':
                    $('#primary-select').removeClass().addClass('col-sm-6');
                    $('#last-n-days').removeClass().addClass('col-sm-6');
                    // toggle unused
                    $('#month').addClass('hidden');
                    $('#year').addClass('hidden');
                    $('#quarter').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
                case 'next-n-days':
                    $('#primary-select').removeClass().addClass('col-sm-6');
                    $('#next-n-days').removeClass().addClass('col-sm-6');
                    // toggle unused
                    $('#month').addClass('hidden');
                    $('#year').addClass('hidden');
                    $('#quarter').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
                case 'month':
                    $('#primary-select').removeClass().addClass('col-sm-4');
                    $('#month').toggleClass('hidden');
                    $('#year').toggleClass('hidden');
                    // toggle unused                           
                    $('#quarter').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
                case 'year':
                    $('#primary-select').removeClass().addClass('col-sm-6');
                    $('#year').removeClass().addClass('col-sm-6');
                    // toggle unused
                    $('#month').addClass('hidden');
                    $('#quarter').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
                case 'quarter':
                    $('#primary-select').removeClass().addClass('col-sm-4');
                    $('#year').removeClass().addClass('col-sm-4');
                    $('#quarter').removeClass().addClass('col-sm-4');
                    // toggle unused
                    $('#month').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
                case 'exact-date':
                    $('#primary-select').removeClass().addClass('col-sm-6');
                    $('#exact-date').removeClass().addClass('col-sm-6');
                    // toggle unused
                    $('#month').addClass('hidden');
                    $('#year').addClass('hidden');
                    $('#quarter').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    break;
                case 'custom-range':
                    $('#primary-select').removeClass().addClass('col-sm-4');
                    $('#range-from').removeClass().addClass('col-sm-4');
                    $('#range-to').removeClass().addClass('col-sm-4');
                    // toggle unused
                    $('#month').addClass('hidden');
                    $('#year').addClass('hidden');
                    $('#quarter').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
                default:
                    $('#primary-select').removeClass().addClass('col-sm-12');
                    $('#month').addClass('hidden');
                    $('#year').addClass('hidden');
                    $('#quarter').addClass('hidden');
                    $('#next-n-days').addClass('hidden');
                    $('#last-n-days').addClass('hidden');
                    $('#range-from').addClass('hidden');
                    $('#range-to').addClass('hidden');
                    $('#exact-date').addClass('hidden');
                    break;
            }
        });

    });


    // chart data

});