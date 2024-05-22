/// This adds event listeners to our inline forms that contain a 'source' hidden field
/// and sends an event to Plausible.
document.addEventListener("DOMContentLoaded", function() {
    // Function to handle form submission
    function handleFormSubmission(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Get the form element
        var form = event.target;

        // Get the value of the hidden input with name "source" if it exists
        var sourceInput = form.querySelector('input[name="source"]');
        if (sourceInput) {
            var sourceValue = sourceInput.value;

            // Call plausible function with the form conversion and source value
            plausible('Newsletter Form Conversion', {props: {form: sourceValue}});
        }

        // Submit the form programmatically after sending the plausible event
        form.submit();
    }

    // Select all forms on the page
    var forms = document.querySelectorAll('form');

    // Attach event listener to each form
    forms.forEach(function(form) {
        form.addEventListener("submit", handleFormSubmission);
    });
});
