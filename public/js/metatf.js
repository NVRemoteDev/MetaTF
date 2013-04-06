$(document).ready(function() {
  // Handler for .ready() called.

  $(".bpitem").mousemove(function (e) {
    $("div", this).addClass('show').css('left', e.pageX - 50).css('top', e.pageY - 120);
  });

  $(".bpitem").mouseout(function () {
    $("div", this).removeClass('show');
  });
});