// Đợi cấu trúc DOM tải xong hoàn toàn để đảm bảo các thành phần HTML tồn tại trước khi kịch bản chạy
$(document).ready(function() {
  // Xác định xem trang hiện tại có phải là trang con (trong thư mục pages/) hay không
  const isSubPage = window.location.pathname.includes("/pages/");
  const prefix = isSubPage ? "../" : "";

  // Hàm tải động component topbar.html vào vùng hiển thị tương ứng
  loadTopbarComponent(prefix, isSubPage);
  // Hàm tải động component navbar.html vào vùng hiển thị tương ứng
  loadNavbarComponent(prefix, isSubPage);
  // Hàm tải động component footer.html vào vùng hiển thị tương ứng
  loadFooterComponent(prefix, isSubPage);
});

/*
  Hàm điều chỉnh các đường dẫn tương đối (href, src) khi tải component vào trang con:
  - Nếu là trang con, tự động thêm tiền tố "../" vào trước các đường dẫn tương đối (không bắt đầu bằng http, data, #, mailto, tel).
*/
function adjustRelativePaths(container, isSubPage) {
  if (!isSubPage) return;
  
  // Sửa href cho các liên kết
  container.find("a").each(function() {
    let href = $(this).attr("href");
    if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("javascript:") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
      $(this).attr("href", "../" + href);
    }
  });
  
  // Sửa src cho các hình ảnh/icons
  container.find("img").each(function() {
    let src = $(this).attr("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("../")) {
      $(this).attr("src", "../" + src);
    }
  });
}

/*
  Hàm highlightActiveNavLink:
  - Tự động làm nổi bật liên kết tương ứng với trang hiện tại trong navbar.
*/
function highlightActiveNavLink(container) {
  let currentPath = window.location.pathname;
  let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  if (filename === "" || filename === "index.html") {
    filename = "index.html";
  }

  container.find(".nav-link").removeClass("active").removeAttr("aria-current");

  container.find(".nav-link").each(function() {
    let href = $(this).attr("href");
    if (href) {
      let linkFilename = href.substring(href.lastIndexOf('/') + 1);
      if (linkFilename === filename) {
        $(this).addClass("active");
        $(this).attr("aria-current", "page");
      }
    }
  });
}

/*
  Hàm loadTopbarComponent:
  - Sử dụng phương thức $.load() của jQuery để tải nội dung HTML từ file component.
*/
function loadTopbarComponent(prefix, isSubPage) {
  const topbarPlaceholder = $("#topbar-placeholder");
  
  if (topbarPlaceholder.length > 0) {
    topbarPlaceholder.load(prefix + "compoments/topbar.html", function(response, status, xhr) {
      if (status === "error") {
        console.error("Lỗi khi tải component topbar.html: " + xhr.status + " " + xhr.statusText);
      } else {
        adjustRelativePaths(topbarPlaceholder, isSubPage);
      }
    });
  }
}

/*
  Hàm loadNavbarComponent:
  - Tải động menu điều hướng (Navbar) vào placeholder tương ứng trên trang chính.
*/
function loadNavbarComponent(prefix, isSubPage) {
  const navbarPlaceholder = $("#navbar-placeholder");
  
  if (navbarPlaceholder.length > 0) {
    navbarPlaceholder.load(prefix + "compoments/navbar.html", function(response, status, xhr) {
      if (status === "error") {
        console.error("Lỗi khi tải component navbar.html: " + xhr.status + " " + xhr.statusText);
      } else {
        adjustRelativePaths(navbarPlaceholder, isSubPage);
        highlightActiveNavLink(navbarPlaceholder);
      }
    });
  }
}

/*
  Hàm loadFooterComponent:
  - Tải động chân trang (Footer) vào placeholder tương ứng trên trang chính.
*/
function loadFooterComponent(prefix, isSubPage) {
  const footerPlaceholder = $("#footer-placeholder");
  
  if (footerPlaceholder.length > 0) {
    footerPlaceholder.load(prefix + "compoments/footer.html", function(response, status, xhr) {
      if (status === "error") {
        console.error("Lỗi khi tải component footer.html: " + xhr.status + " " + xhr.statusText);
      } else {
        adjustRelativePaths(footerPlaceholder, isSubPage);
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

/*
  Course Program Item Click Handler:
  - Khi người dùng click vào một mục khóa học (.course-program-item), làm sáng mục đó bằng class 'active'.
  - Loại bỏ trạng thái 'active' của mục cũ.
  - Đồng thời hoán đổi icon puzzle (màu xanh cho active, màu trắng cho inactive).
*/
$(document).on("click", ".course-program-item", function() {
  const currentActive = $(".course-program-item.active");
  
  // Nếu click vào mục đang active thì bỏ qua
  if (currentActive.is(this)) return;

  // Tắt active của mục cũ và đổi icon của nó về trắng
  if (currentActive.length > 0) {
    currentActive.removeClass("active");
    const activeIcon = currentActive.find(".course-program-icon");
    const activeSrc = activeIcon.attr("src");
    if (activeSrc && !activeSrc.includes("-white.svg")) {
      activeIcon.attr("src", activeSrc.replace(".svg", "-white.svg"));
    }
  }

  // Bật active cho mục mới và đổi icon của nó thành màu xanh (không có -white)
  const newItem = $(this);
  newItem.addClass("active");
  const newIcon = newItem.find(".course-program-icon");
  const newSrc = newIcon.attr("src");
  if (newSrc && newSrc.includes("-white.svg")) {
    newIcon.attr("src", newSrc.replace("-white.svg", ".svg"));
  }
});

