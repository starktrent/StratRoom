// Code By Webdevtrick ( https://webdevtrick.com )
function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function () {
      var htmlPreview =
        '<div class="box-body-border">' +
        '<img width="20" src="' +
        "./images/file-icon.png" +
        '" />' +
        "<span>" +
        input.files[0].name +
        "</span>" +
        "<span>" +
        "<i class='fa fa-times remove-preview'></i>" +
        "</span>" +
        "</div>";
      var wrapperZone = $(input).parent();
      var previewZone = $(input).parent().parent().find(".preview-zone");
      var boxZone = $(input)
        .parent()
        .parent()
        .find(".preview-zone")
        .find(".box")
        .find(".box-body");

      wrapperZone.removeClass("dragover");
      previewZone.removeClass("hidden");
      boxZone.empty();
      boxZone.append(htmlPreview);
      removeFile();
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function reset(e) {
  e.wrap("<form>").closest("form").get(0).reset();
  e.unwrap();
}

$(".dropzone").change(function () {
  readFile(this);
});

$(".dropzone-wrapper").on("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).addClass("dragover");
});

$(".dropzone-wrapper").on("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).removeClass("dragover");
});

function removeFile() {
  $(".remove-preview").on("click", function () {
    var boxZone = $(this).parents(".preview-zone").find(".box-body");
    var previewZone = $(this).parents(".preview-zone");
    var dropzone = $(this).parents(".form-group").find(".dropzone");
    boxZone.empty();
    console.log("done");
    previewZone.addClass("hidden");
    reset(dropzone);
  });
}

$("#next-btn-1").click(function () {
  $("#file-upload").hide();
  $("#file-validate").show();
  $("#file-save").hide();
  $(".form-progressbar li:nth-child(1)").addClass("active");
});

$("#next-btn-2").click(function () {
  $("#file-upload").hide();
  $("#file-validate").hide();
  $("#file-save").show();
  $(".form-progressbar li:nth-child(2)").addClass("active");
});

$("#prev-btn").click(function () {
  $("#file-upload").show();
  $("#file-validate").hide();
  $("#file-save").hide();
  $(".form-progressbar li:nth-child(1)").removeClass("active");
});
