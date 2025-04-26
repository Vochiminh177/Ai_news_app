//Hàm sử lý đăng ký
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  //step 1 : kiểm tra form có tồn tại
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      //step 2: lấy dữ liệu từ form
      const formData = new FormData(loginForm);

      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      //step 3; gửi dữ liệu lên api
      try {
        const response = await fetch("/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
              .value,
          },
          body: JSON.stringify(data),
        });
        //Step 4:Nhận phản hồi
        const result = await response.json();
        //step 5: hiển thị
        if (response.ok) {
          alert("Đăng nhập thành công!");
          const role = result.role;
          if (role.includes("admin")) {
            window.location.href = "admin";
          } else {
            window.location.href = "home";
          }
        } else {
          alert(result.error || "Đăng nhập thất bại");
        }
      } catch (error) {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signinForm");
  //step 1 ; Kiểm tra form có tồn tại
  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      //step 2: lấy dữ liệu từ form
      const formData = new FormData(signupForm);
      const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        password2: formData.get("password2"),
      };
      //step 3: Gửi dữ liệu đến api
      const csrfToken = document.querySelector(
        "[name=csrfmiddlewaretoken]"
      )?.value;

      if (!csrfToken) {
        alert("Lỗi CSRF! Hãy thử tải lại trang.");
        return;
      }

      try {
        const response = await fetch("/api/signin/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(data),
        });
        //step 4 :Nhận phản hồi
        const responseText = await response.text();
        //step 5: Xử lý phản hồi
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { error: "Phản hồi từ server không hợp lệ!" };
        }
        if (response.ok) {
          window.location.href = "login_page";
        } else {
          document.getElementById("error-message").textContent =
            result.error || "Đăng ký thất bại!";
        }
      } catch (error) {
        document.getElementById("error-message").textContent =
          " Lỗi kết nối, vui lòng thử lại!";
      }
    });
  }
});
