function scrollytelling() {

    var controller = new ScrollMagic.Controller();

    var pin_energy_plot = new ScrollMagic.Scene({
          offset: window.innerHeight, // start scene after scrolling length of browser height
          duration: 700 // pin the element for a total of 400 px
    })
    .setPin('#energy-chart')

    // Add scene to the controller
    controller.addScene(pin_energy_plot);

    /*
      TO-DO: Would be better if I could make this into a function.
      Also, it would look better if the trigger were halfway through the plot,
      or a third of the browser window, instead of half the browser window.
    */
    new ScrollMagic.Scene({
        triggerElement: "#energy-slide-1",
        duration: 220
    })
    .setClassToggle("#energy-slide-1", "active")
    .addTo(controller)

    new ScrollMagic.Scene({
        triggerElement: "#energy-slide-2",
        duration: 220
    })
    .setClassToggle("#energy-slide-2", "active")
    .addTo(controller)

    new ScrollMagic.Scene({
        triggerElement: "#energy-slide-3",
        duration: 220
    })
    .setClassToggle("#energy-slide-3", "active")
    .addTo(controller)

    new ScrollMagic.Scene({
        triggerElement: "#energy-slide-4",
        duration: 220
    })
    .setClassToggle("#energy-slide-4", "active")
    .addTo(controller)


}

scrollytelling();
