// Đợi cấu trúc DOM tải xong hoàn toàn để đảm bảo các thành phần HTML tồn tại trước khi kịch bản chạy
$(document).ready(function() {
  // Hàm tải động component topbar.html vào vùng hiển thị tương ứng
  loadTopbarComponent();
  // Hàm tải động component navbar.html vào vùng hiển thị tương ứng
  loadNavbarComponent();

  // Hàm tải động component footer.html vào vùng hiển thị tương ứng
  loadFooterComponent();
});

/*
  Hàm loadTopbarComponent:
  - Sử dụng phương thức $.load() của jQuery để tải nội dung HTML từ file component.
  - Thực hiện xử lý lỗi chi tiết nếu yêu cầu Ajax không thành công (ví dụ do lỗi CORS khi chạy local).
*/
function loadTopbarComponent() {
  const topbarPlaceholder = $("#topbar-placeholder");
  
  if (topbarPlaceholder.length > 0) {
    topbarPlaceholder.load("compoments/topbar.html", function(response, status, xhr) {
      if (status === "error") {
        console.error("Lỗi khi tải component topbar.html: " + xhr.status + " " + xhr.statusText);
      }
    });
  }
}

/*
  Hàm loadNavbarComponent:
  - Tải động menu điều hướng (Navbar) vào placeholder tương ứng trên trang chính.
  - Tương tự như topbar, xử lý báo lỗi nếu không tải được tệp html.
*/
function loadNavbarComponent() {
  const navbarPlaceholder = $("#navbar-placeholder");
  
  if (navbarPlaceholder.length > 0) {
    navbarPlaceholder.load("compoments/navbar.html", function(response, status, xhr) {
      if (status === "error") {
        console.error("Lỗi khi tải component navbar.html: " + xhr.status + " " + xhr.statusText);
      }
    });
  }
}


/*
  Hàm loadFooterComponent:
  - Tải động chân trang (Footer) vào placeholder tương ứng trên trang chính.
  - Xử lý báo lỗi nếu không tải được tệp footer.html.
*/
function loadFooterComponent() {
  const footerPlaceholder = $("#footer-placeholder");
  
  if (footerPlaceholder.length > 0) {
    footerPlaceholder.load("compoments/footer.html", function(response, status, xhr) {
      if (status === "error") {
        console.error("Lỗi khi tải component footer.html: " + xhr.status + " " + xhr.statusText);
      }
    });
  }
}

/*
  FAQ Accordion Click Handler:
  - Khi click vào tiêu đề câu hỏi (.faq-header), toggle class 'open' cho khối câu hỏi (.faq-item).
  - Điều chỉnh chiều cao tối đa (max-height) của phần trả lời (.faq-answer) để tạo hiệu ứng trượt mượt mà.
  - Tự động đóng các câu hỏi khác đang mở.
*/
$(document).on("click", ".faq-header", function() {
  const item = $(this).closest(".faq-item");
  const answer = item.find(".faq-answer");
  
  if (item.hasClass("open")) {
    item.removeClass("open");
    answer.css("max-height", "0");
  } else {
    // Đóng các câu hỏi khác đang mở
    $(".faq-item.open").removeClass("open").find(".faq-answer").css("max-height", "0");
    
    item.addClass("open");
    answer.css("max-height", answer[0].scrollHeight + "px");
  }
});
