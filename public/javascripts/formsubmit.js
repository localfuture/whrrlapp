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
      window.location = "/formview";
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
  window.localStorage.removeItem("aadhaar");
  window.location = "/";
}

function getFormData() {
  const userId = window.localStorage.getItem('userId');

  var url = "/formdata/" + userId;
  

  $.ajax({
    headers: {
      "Content-Type": "application/json",
    },
    url: url,
    type: "GET",
    success: function (data) {
      window.localStorage.setItem('aadhaar', data.result.aadhaarUri);
      $("input[name='fullName']").val(data.result.fullName);
      $("input[name='emailId']").val(data.result.emailId);
      $("input[name='mobileNumber']").val(data.result.mobileNumber);
      $("input[name='nationality']").val(data.result.nationality);
      // $("input[name='fullName']").val(data.result.fullName);
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

function download() {
  const aadhaar = window.localStorage.getItem('aadhaar');

  var url = "/download/" + aadhaar;

  window.location = url;

  // $.ajax({
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   url: url,
  //   type: "GET",
  //   success: function (data) {
     
  //   },
  //   fail: function (response) {
  //     console.log(response);
  //   },
  //   error: function (data) {
  //     Swal.fire("Oops", data.responseJSON.message, "error").then(() => {
  //       window.location = "/home";
  //     });
  //   },
  //   contentType: false,
  //   processData: false,
  // });

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
