$(document).ready(function () {
  // add to cart
  $(".add_to_cart").on("click", function (e) {
    e.preventDefault();
    food_id = $(this).attr("data-id");
    url = $(this).attr("data-url");

    $.ajax({
      type: "GET",
      url: url,

      success: function (response) {
        console.log(response);
        if (response.status == "login_required") {
          swal(response.message, "", "info").then(function () {
            window.location = "/login";
          });
        }
        if (response.status == "Failed") {
          swal(response.message, "", "error");
        } else {
          $("#cart_counter").html(response.cart_counter["cart_count"]);
          $("#qty-" + food_id).html(response.qty);
          // Reload the page to reflect changes
          window.location.reload();

          //subtotal,tax and grand total
          applyCartAmounts(
            response.cart_amount["subtotal"],
            response.cart_amount["tax"],
            response.cart_amount["grand_total"]
          );
        }
      },
    });
  });

  //place the cart item quantity on load
  $(".item_qty").each(function () {
    var the_id = $(this).attr("id");
    var qty = $(this).attr("data-qty");
    $("#" + the_id).html(qty);
  });

  // decrease to cart
  $(".decrease_cart").on("click", function (e) {
    e.preventDefault();
    food_id = $(this).attr("data-id");
    url = $(this).attr("data-url");
    cart_id = $(this).attr("id");

    $.ajax({
      type: "GET",
      url: url,

      success: function (response) {
        console.log(response);
        if (response.status == "login_required") {
          swal(response.message, "", "info").then(function () {
            window.location = "/login";
          });
        } else if (response.status == "Failed") {
          swal(response.message, "", "error");
        } else {
          $("#cart_counter").html(response.cart_counter["cart_count"]);
          $("#qty-" + food_id).html(response.qty);
          // Reload the page to reflect changes
          window.location.reload();

          applyCartAmounts(
            response.cart_amount["subtotal"],
            response.cart_amount["tax"],
            response.cart_amount["grand_total"]
          );

          if (window.location.pathname == "/cart/") {
            removeCartItem(response.qty, cart_id);
            checkEmptyCart();
          }
        }
      },
    });
  });

  //DElete cart item
  $(".delete_cart").on("click", function (e) {
    e.preventDefault();

    cart_id = $(this).attr("data-id");
    url = $(this).attr("data-url");

    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        console.log(response);
        if (response.status == "Failed") {
          swal(response.message, "", "error");
        } else {
          $("#cart_counter").html(response.cart_counter["cart_count"]);
          swal(response.status, response.message, "Success");
          // Reload the page to reflect changes
          window.location.reload();

          applyCartAmounts(
            response.cart_amount["subtotal"],
            response.cart_amount["tax"],
            response.cart_amount["grand_total"]
          );

          removeCartItem(0, cart_id);
          checkEmptyCart();
        }
      },
    });
  });
  //delete the cart element if the qty is 0
  function removeCartItem(cartItemQty, cart_id) {
    if (window.location.pathname == "/cart/") {
      if (cartItemQty <= 0) {
        // remove the cart item element
        document.getElementById("cart-item-" + cart_id).remove();
      }
    }
  }

  //check if the cart is empty
  function checkEmptyCart() {
    var cart_counter = document.getElementById("cart_counter").innerHTML;
    if (cart_counter == 0) {
      document.getElementById("empty-cart").style.display = "block";
    }
  }

  // apply cart amounts
  function applyCartAmounts(subtotal, tax, grand_total) {
    if (window.location.pathname == "/cart/") {
      $("#subtotal").html(subtotal);
      $("#tax").html(tax);
      $("#total").html(grand_total);
    }
  }
  // ADD OPENING HOUR
  $(".add_hour").on("click", function (e) {
    e.preventDefault();
    var day = document.getElementById("id_day").value;
    var from_hour = document.getElementById("id_from_hour").value;
    var to_hour = document.getElementById("id_to_hour").value;
    var is_closed = document.getElementById("id_is_closed").checked;
    var csrf_token = $("input[name=csrfmiddlewaretoken]").val();
    var url = document.getElementById("add_hour_url").value;

    console.log(day, from_hour, to_hour, is_closed, csrf_token);
    if (is_closed) {
      is_closed = "True";
      condition = "day != ''";
    } else {
      is_closed = "False";
      condition = "day != '' && from_hour != '' && to_hour != ''";
    }
    if (eval(condition)) {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          day: day,
          from_hour: from_hour,
          to_hour: to_hour,
          is_closed: is_closed,
          csrfmiddlewaretoken: csrf_token,
        },
        success: function (response) {
          if (response.status == "success") {
            if (response.is_closed == "Closed") {
             html = '<tr id="hour-'+response.id+'"><td><b>'+response.day+'</b></td><td>Closed</td><td><a href="#" class="remove_hour" data-url="/vendor/opening-hours/remove/'+response.id+'/">Remove</a></td></tr>';
            } else {
               html ='<tr id="hour-' + response.id + '"><td><b>' + response.day + "</b></td><td>" + response.from_hour + " - " + response.to_hour + '</td><td><a href="#" class="remove_hour" data-url="/vendor/opening-hours/remove/' + response.id +'/">Remove</a></td></tr>';
            }

            $(".opening_hours").append(html);
            document.getElementById("opening_hours").reset();
          } else {
            swal(response.message, "", "error");
          }
        },
      });
    } else {
      swal("please fill all fields", "", "info");
    }
  });
  // REMOVE OPENING HOUR
  $(document).on("click", ".remove_hour", function (e) {
    e.preventDefault();
    url = $(this).attr("data-url");

    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        if (response.status == "success") {
          document.getElementById("hour-" + response.id).remove();
        }
      },
    });
  });

  //DOCUMENT READY TO CLOSE
});
        
        
    