function scrollytelling() {

    var controller = new ScrollMagic.Controller();

    var scene = new ScrollMagic.Scene({
      offset: 200, // start scene after scrolling for 200px
      duration: 400 // pin the element for a total of 400 px
      
      // TO DO: need to change offset and duration values based on window.innerHeight.
    })
    .setPin('#energy-chart')

    // Add scene to the controller
    controller.addScene(scene);

}

scrollytelling();
