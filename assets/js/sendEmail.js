/*Script send email code from code course adapted for this*/

document.getElementById("exampleInputEmail").value = localStorage.getItem("textOneValue");

function sendEmail(signInForm) {
    emailjs.send("gmail", "template_vuxmZcCD", {
        "from_name": signInForm.exampleInputName.value,
        "from_email": signInForm.exampleInputEmail.value,
        "from_last_name": signInForm.exampleInputLastName.value,
        "from_country": signInForm.exampleInputCountry.value,
        })

        .then (
            function(response) {
            alert("Your mail is sent!", response);
            console.log("SUCCESS!", response);
            $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
            $(':checkbox, :radio').prop('checked', false);
            },
            function(error) {
            alert("Oops...", error);    
            console.log("FAILED...", error);
            },
        )
           
        
    return false;
}  

/*var myLoader = $("#loading");
    $("#user-data").submit(function sendEmail(signInForm) { /*code to show loader 
        setTimeout(function(){
            let loading = document.getElementById("loading").value;
            console.log(loading);
            $("#loading").hide();
        })
    })   */