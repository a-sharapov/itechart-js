'use strict'
document.addEventListener("DOMContentLoaded", () => {
  for (let i=1; i <= 20; i++) {
    let elI = document.createElement("span")
    document.querySelector(".background").append(elI)
  }

  const demoForm = document.querySelector("#demo-form")
  demoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let ts = Math.round(e.timeStamp)
    const out = {},
      parameters = {},
      sData = new FormData(e.target)
    for (let entry of sData) {
      if (entry[1] !== "") {
        if (entry[0] === "hiderCounter") {
          parameters[entry[0]] = entry[1]*1000
        } else {
          parameters[entry[0]] = entry[1]
        }
      }
    }
    switch (parameters.dialogType) {
      case "popup":
        out[ts] = new CustomDialog(parameters)
        break;
      case "toast":
        out[ts] = new ToastCustomDialog(parameters)
        break;
      case "window":
        out[ts] = new WindowCustomDialog(parameters)
        break;
    }

    eval(
      out[Object.keys(out)[Object.keys(out).length - 1]].create(), 
      setTimeout(() => {
        out[Object.keys(out)[Object.keys(out).length - 1]].show()
      }, 10)
      
    )
  });
})