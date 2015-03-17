# Kaazing-SportsBook

This is a SportsBook Demo that demonstrates the delivery of real-time pricing odds to an In-Play Sports Book demo application.

# Installation

The SportsBookData.jar file is the data generator and it needs to be copied to a location that can be accessed and has the admin rights to run a java application using the java -jar command.

Navigate to the following directory where the instance of the KAAZING Gateway has been installed and create a new folder called SportsBook :

    /web/extras/demo/jms/SportsBook
    
Copy all the application source code, including folders and folder contents into this SportsBook folder. You should have a SportsBook folder structure as below:

    css
    images
    jms
    js
    lib
    Admin.html
    KaazingSports.html
    login.html

# Running Locally

Ensure you have ActiveMQ installed and is running, this comes with the product. 
Ensure you have at least the 4.0.6 KAAZING Gateway version installed and running.

To start the data feed, open a command prompt and navigate to the location of the SportsBookData jar file, then issue the following command to initialise the generator:

    java -jar SportsBookData.jar. 

The URL to run the application will be:

    localhost:8001/demo/jms/SportsBook/Login.html

If you want to use the Admin screen, use the following Login credentials (CASE sensitive):

    Username: Admin
    Password: admin
    
If you want to use the SportsBook client UI, login as yourself, it does not validate the user or the password. Your Username will appear at the top of the screen.

    Username: Tyron
    Password: test
    
The following video will demonstarte how to use the SportsBook Demo:

    https://youtu.be/Bcs1hcIlPBo

