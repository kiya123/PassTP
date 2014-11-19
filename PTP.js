
hostsList = new Meteor.Collection('host');//creating collection for MongoDB for both client and server

if (Meteor.isClient) {//to be done on the clients browser

  Accounts.ui.config({//to make account creation using username and email
   passwordSignupFields: 'USERNAME_AND_EMAIL'
                    });
  Meteor.subscribe('theHost');/*for making the data accessible through the
                                  web browser and through the Console*/
      Template.show.helpers({//functions accesses in the show template 
        'hosts': function(){//to display event registeration according to their account
             var currentUserId = Meteor.userId();
            // Retrieve all of the events registered by this user from the "hostsList" collection and order them based on the events day 
             return hostsList.find({}, {sort: {eventDate: 1} });//retrieve data that’s being published from the server.
                  }
                  });

      Template.show.events({
      
        'click .remove': function(){//to cancel registerations
           var check=confirm("Do you Really want to remove this event");
           if(check==1){//if ok button pressed
            var hostsId = this._id;
           Meteor.call('removeHosts',hostsId);}
            
                  },

        'click .confirm': function(){//to confirm their registration
           var check=confirm("Notice: Once it is confirmed no refund is available");
         if(check==1){//if ok button pressed
                    var hostsId = this._id;
                    Meteor.call('confirmEvent',hostsId);
                     }
                                    } 
                         });

      Template.registerForm.events({

       'submit form': function(event){//form for registering the event
          event.preventDefault();//to prevent default browser action
          //var currentUserId = Meteor.userId();//id of currently logged in user
       
          //collect the data from the form elements 
          var hostNameVar=event.target.Hname.value;
          var hostEmailVar=event.target.Hemail.value;
          var hostTelnumVar=event.target.tel.value;
          var eventaddVar=event.target.add.value;
          var eventDateVar=event.target.Edate.value;
          var movieTitleVar=event.target.Mtitle.value;
          //call to the method insertHost in isServer block and passing arguments with it
          Meteor.call('insertHosts', hostNameVar,hostEmailVar,hostTelnumVar,eventaddVar,eventDateVar,movieTitleVar);
         
      //clears the fields after insertion
          event.target.Hname.value="";
          event.target.Hemail.value="";
          event.target.tel.value="";
          event.target.add.value="";
          event.target.Edate.value="";
          event.target.Mtitle.value="";
         
                                    }
                                   });
                   }

if (Meteor.isServer) {
            //codes that need to be executed on the server 
               
     Meteor.publish('theHost', function(){//specify what data should be available to the users
                var currentUserId = this.userId;//to access the unique ID of the currently logged in user
                return hostsList.find({registeredBy: currentUserId});/*returns only the data that belongs to the currently logged in user, and if
                                                                     you’re not logged in, you won’t see any data.*/
                 });
     Meteor.methods({//block of code used to create methods
                   'insertHosts': function(hostNameVar,hostEmailVar,hostTelnumVar,eventaddVar,eventDateVar,movieTitleVar){
                       var currentUserId = Meteor.userId(); 
                        if(!(Meteor.user().username))
                       var currentUserName = Meteor.user().profile.name//for accounts logged in using facebook and twitter
                          else{
                       var currentUserName = Meteor.user().username;//for accounts accessed through direct account
                        }
                       hostsList.insert({//to insert the received data to 'hostsList' MongoDB collection
                       HostName: hostNameVar,hostEmail: hostEmailVar,
                       hostTelnum: hostTelnumVar,eventAddress: eventaddVar,
                       eventDate: eventDateVar,movieTitle: movieTitleVar,
                       registeredBy: currentUserId,registeredByName:currentUserName,
                       status:"Unconfirmed"
                          });  

                          },
                    'removeHosts': function(hostsId ){//to remove booked events
                               hostsList.remove(hostsId);
                                                     },
                    'confirmEvent': function(hostsId ){//to confirm booked events
                               hostsList.update(hostsId, {$set:{status: "confirmed"}});
                                                     }

                          });//methods
         Meteor.startup(function () {
    // code to run on server at startup if there is any
                 });
                  }
