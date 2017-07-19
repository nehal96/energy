function scrollytelling() {

    var controller = new ScrollMagic.Controller();

    var scene = new ScrollMagic.Scene({
      offset: window.innerHeight, // start scene after scrolling for 200px
      duration: 400 // pin the element for a total of 400 px
    })
    .setPin('#energy-chart')

    // Add scene to the controller
    controller.addScene(scene);

}

scrollytelling();
