const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const mailchimp=require("@mailchimp/mailchimp_marketing");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

mailchimp.setConfig({
    apiKey:"c806e5111c6a2b739e4138985a4ef9a8-us21",
    server:"us21"
})

app.post("/", function (req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.Email;
    const listId="8107fb2506";
    const subscriber={
        firstName:fName,
        lastName:lName,
        email:email
    }
    async function run() {
        const response=await mailchimp.lists.addListMember(listId,{
            email_address:subscriber.email,
            status:"subscribed",
            merge_fields:{
                FNAME:subscriber.firstName,
                LNAME:subscriber.lastName
            }
        });
        res.sendFile(__dirname+"/success.html")
        console.log(`Successfully added contact as an audience member. The contact's id is ${
            response.id
            }.`
        );
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
})
//API Key
//c806e5111c6a2b739e4138985a4ef9a8-us21
//List Id
//8107fb2506