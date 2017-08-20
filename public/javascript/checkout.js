// Stripe.setPublishableKey('pk_test_rahsVPZ0S6q7a999jFbbkwdA');
// // var stripe = Stripe('pk_test_rahsVPZ0S6q7a999jFbbkwdA');
// // Stripe(publishableKey);

// var $form = $('#checkout-form');

// $form.submit(function(event){
//     $('#charge-error').removeClass('hidden');
//     $form.find('button').prop('disabled', true);
//     Stripe.card.createToken({
//         number: $('#card-number').val(),
//         cvc: $('#card-cvc').val(),
//         exp_month: $('#card-expiry-month').val(),
//         exp_year: $('#card-expiry-year').val(),
//         name: $('#card-name').val()
//     }, stripeResponseHandler);
//     return false;
// });

// function stripeResponseHandler(status, response) {
//     if (response.error) {
//         $('#charge-error').text(response.error.message);
//         $('#charge-error').removeClass('hidden');
//         $form.find('button').prop('disabled', false);
//     } else {
//         var token = response.id;
//         $form.append($('<input type="hidden" name="stipeToken" />').val(token));
//         $form.get(0).submit();
//     }
// }


// Create a Stripe client
var stripe = Stripe('pk_test_rahsVPZ0S6q7a999jFbbkwdA');

// Create an instance of Elements
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) { 
      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}