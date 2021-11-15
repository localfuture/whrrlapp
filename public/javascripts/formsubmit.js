function formSubmit() {
  event.preventDefault();
  var url = "/form";

  var formInput = $("form").serializeObject();
  const userId = window.localStorage.getItem("userId");
  formInput.userId = userId;

  var formData = JSON.stringify(formInput);

  $.ajax({
    headers: {
      "Content-Type": "application/json",
    },
    url: url,
    type: "POST",
    data: formData,
    success: function (data) {
      console.log(data);
    },
    fail: function (response) {
      console.log(response);
    },
    error: function (data) {
      Swal.fire("Oops", data.responseJSON.message, "error").then(() => {
        window.location = "/home";
      });
    },
    contentType: false,
    processData: false,
  });
}

function logOut() {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("email");
  window.localStorage.removeItem("userId");
  window.location = "/";
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
