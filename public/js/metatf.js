$(document).ready(function() {
  // Handler for .ready() called.

  $(".bpitem").mousemove(function (e) {
    $("div", this).addClass('show').css('left', e.pageX + 25).css('top', e.pageY - 50);
  });

  $(".bpitem").mouseout(function () {
    $("div", this).removeClass('show');
  });
});