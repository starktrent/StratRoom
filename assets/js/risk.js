$(document).on("click", ".clickable-text", function() {
    var impact = $(this).html();
    var score1 = $(this)
        .parent()
        .find(".score1")
        .html();
    var score2 = $(this)
        .parent()
        .find(".score2")
        .html();
    var text2 = $(this)
        .parent()
        .find(".text2")
        .html();
    var score = score1 * score2;
    $(".risk-score").text(score);
    $(".impact-text").text(impact);
    $(".like-text").text(text2);
});

$(document).on("click", ".new-collapse", function() {
    $(this)
        .parent()
        .parent()
        .next("div")
        .toggleClass("show");
});

$template = $(".acc-main-template");
$template1 = $(".acc-inner-template");

var hash = 2;
$(".add_consq").on("click", function() {
    var $newPanel = $template.clone();
    $newPanel.removeClass("hidden");
    $newPanel.attr("id", "#new_id_" + hash);
    $newPanel
        .find("a")
        .attr("href", "#new_acc_" + ++hash)
        .attr("data-parent", "#new_id_" + hash)
        .attr("area-collapse", "#new_acc_" + hash);

    $newPanel
        .find(".panel-collapse")
        .attr("id", "#new_acc_" + hash)
        .attr("area-labelledby", "#new_acc_" + hash)
        .addClass("collapse");

    $(".cause-acc-main").append($newPanel.fadeIn());
});

$("body").on("click", ".add-cons", function() {
    var parent_div = $(this)
        .parent()
        .parent()
        .parent();
    var $newPanel = $template1.clone();
    $newPanel.removeClass("hidden");
    $(parent_div).prepend($newPanel.fadeIn());
});

function formatState(state) {
    if (!state.id) {
        return state.text;
    }
    var baseUrl = "../../assets/images";
    var $state = $(
        '<span class="avatar avatar-sm"><img src="' +
        baseUrl +
        "/" +
        state.element.value.toLowerCase() +
        '.jpg" class="img-flag rounded-circle sub_init_img" /> ' +
        state.text +
        "</span>"
    );
    return $state;
}

$("#inputState, #inputState1").select2({
    templateResult: formatState,
    multiple: true
});

$(".select2-dropdown").slimscroll({
    height: "200px",
    size: "3px",
    color: "#9c9c9c"
});

$(".top-bar-badge").click(function() {
    $(this)
        .next("select")
        .trigger("change");
});