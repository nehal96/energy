function scrollytelling() {

    var controller = new ScrollMagic.Controller();

    var scene = new ScrollMagic.Scene({
      offset: 100, // start scene after scrolling for 100px
      duration: 400 // pin the element for a total of 400 px
    })
    .setPin('#energy-chart')

    // Add scene to the controller
    controller.addScene(scene);

}
