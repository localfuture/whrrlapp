function createUser() {
  event.preventDefault();
  var url = "/signup";

  var formData = JSON.stringify($("form").serializeObject());

  $.ajax({
    headers: {
      "Content-Type": "application/json",
    },
    url: url,
    type: "POST",
    data: formData,
    success: function (data) {
      console.log(data);
      if (data.result._id) {
        window.localStorage.setItem("token", data.result.token);
        window.localStorage.setItem("email", data.result.email);
        window.localStorage.setItem("userId", data.result._id);
        window.location = "/home";
      }
    },
    fail: function (response) {
      console.log(response);
    },
    error: function (data) {
      Swal.fire("Oops", data.responseJSON.message, "error").then(() => {
        window.location = "/";
      });
    },
    contentType: false,
    processData: false,
  });
}

function login() {
  event.preventDefault();
  var url = "/login";

  var formData = JSON.stringify($("form").serializeObject());

  $.ajax({
    headers: {
      "Content-Type": "application/json",
    },
    url: url,
    type: "POST",
    data: formData,
    success: function (data) {
      if (data.userId) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("email", data.email);
        window.localStorage.setItem("userId", data.userId);
        // window.location = "/home";
        home();
      }
    },
    fail: function (response) {
      console.log(response);
    },
    error: function (data) {
      Swal.fire("Oops", data.responseJSON.message, "error").then(() => {
        window.location = "/";
      });
    },
    contentType: false,
    processData: false,
  });
}

function home() {
  var url = "/home";

  const token = window.localStorage.getItem("token")

  $.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer" + " " +  token
      );
    },
    headers: {
      "Content-Type": "application/json",
    },
    url: url,
    type: "GET",
    success: function (data) {
      $("html").html(data);
    },
    fail: function (response) {
      console.log(response);
    },
    error: function (data) {
      Swal.fire("Oops", data.responseJSON.message, "error").then(() => {
        window.location = "/";
      });
    },
    contentType: false,
    processData: false,
  });
}

// utils
$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};
