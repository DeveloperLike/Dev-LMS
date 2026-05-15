var util = require('./util.js');
var sha512 = require('js-sha512');

let initiate_payment = function (data, config, res) {

  function isFloat(amt) {
    var regexp = /^\d+\.\d{1,2}$/;
    return regexp.test(amt)
  }


  function checkArgumentValidation(data, config) {

    if (!data.firstname || !data.firstname.trim()) {
      return res.json({
        status: 0,
        data: "Mandatory Parameter firstname cannot be empty"
      });
    }
    if (!(data.amount.trim()) || !(isFloat(data.amount))) {
      res.json({
        "status": 0,
        "data": "Mandatory Parameter amount can not empty and must be in decimal "
      });
    }
    if (!(data.txnid.trim())) {
      res.json({
        "status": 0,
        "data": "Merchant Transaction validation failed. Please enter proper value for merchant txn"
      });
    }
    if (!(data.email.trim()) || !(util.validate_mail(data.email))) {
      res.json({
        "status": 0,
        "data": "Email validation failed. Please enter proper value for email"
      });
    }
    if (!(data.phone.trim()) || util.validate_phone(data.phone)) {
      res.json({
        "status": 0,
        "data": "Phone validation failed. Please enter proper value for phone"
      });
    }
    if (!(data.productinfo.trim())) {
      res.json({
        "status": 0,
        "data": "Mandatory Parameter Product Info cannot be empty"
      });
    }
    if (!(data.surl.trim()) || !(data.furl.trim())) {
      res.json({
        "status": 0,
        "data": "Mandatory Parameter Surl/Furl cannot be empty"
      });
    }
  }


  function geturl(easeBuzzEnv) {
    if (easeBuzzEnv == 'test') {
      url_link = "https://testpay.easebuzz.in/";

    } else if (easeBuzzEnv == 'prod') {
      url_link = 'https://pay.easebuzz.in/';
    } else {
      url_link = "https://testpay.easebuzz.in/";
    }
    return url_link;
  }

  function form() {

    const expiryDate = new Date(Date.now() + 86400000);

    let form = {
      key: config.key,
      txnid: data.txnid,
      amount: data.amount,
      email: data.email,
      phone: data.phone,
      firstname: data.firstname,
      hash: hash_key,
      productinfo: data.productinfo,
      furl: data.furl,
      surl: data.surl,
      expiry_date: expiryDate.toISOString().split("T")[0], // YYYY-MM-DD
      expiry_time: expiryDate.toTimeString().split(" ")[0] // HH:MM:SS
    };

    if (data.udf1) form.udf1 = data.udf1;
    if (data.udf2) form.udf2 = data.udf2;
    if (data.udf3) form.udf3 = data.udf3;
    if (data.udf4) form.udf4 = data.udf4;
    if (data.udf5) form.udf5 = data.udf5;
    if (data.udf6) form.udf6 = data.udf6;
    if (data.udf7) form.udf7 = data.udf7;
    if (data.udf8) form.udf8 = data.udf8;
    if (data.udf9) form.udf9 = data.udf9;
    if (data.udf10) form.udf10 = data.udf10;

    if (data.unique_id) form.unique_id = data.unique_id;
    if (data.split_payments) form.split_payments = data.split_payments;
    if (data.sub_merchant_id) form.sub_merchant_id = data.sub_merchant_id;
    if (data.customer_authentication_id) form.customer_authentication_id = data.customer_authentication_id;

    return form;
  }

  // main calling part is below

  checkArgumentValidation(data, config);

  // stop if validation already responded
  if (res.headersSent) return;

  var hash_key = generateHash();

  const payment_url = geturl(config.env);
  const call_url = payment_url + "payment/initiateLink";

  util.call(call_url, form())
    .then(function (response) {

      console.log("Easebuzz Response:", response.data);

      pay(response.data, payment_url); // pass base URL, not API URL

    })
    .catch(function (err) {

      console.error("Easebuzz Error:", err);

      return res.status(500).json({
        success: false,
        message: "Payment initialization failed"
      });

    });


  function pay(access_key, url_main) {

    if (config.enable_iframe == 0) {

      const url = url_main + 'pay/' + access_key;

      console.log("Redirecting to:", url);

      return res.json({
        success: true,
        payment_url: url
      });

    } else {

      res.render("enable_iframe.html", {
        key: config.key,
        access_key: access_key
      });

    }
  }

  function generateHash() {

    const hashstring =
      config.key + "|" +
      data.txnid + "|" +
      data.amount + "|" +
      data.productinfo + "|" +
      data.firstname + "|" +
      data.email +
      "|||||||||||" +   // udf1–udf10 empty
      config.salt;

    data.hash = sha512.sha512(hashstring);

    return data.hash;
  }

}

exports.initiate_payment = initiate_payment;