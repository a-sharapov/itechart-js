'use strict'
var __extends = function (child, parent) {
  function fn() {
    this.constructor = child
  }
  fn.prototype = parent.prototype
  child.prototype = new fn()
} 

// modifier: error|warning|success|default:info
var customDialog = (function () {
  function customDialog(options = {}) {
    Object.assign(this, {
      dialogType: "popup",
      $el: document.createElement("dialog"),
      content: "Содержимое данного блока не было заданно, его можно задать в соответвующем поле формы",
      parent: "main",
      modifier: "info"
    }, options)
  }
  customDialog.prototype.dialogId = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  }
  customDialog.prototype.setAssets = function (target, options) {
    for (var [p, v] of Object.entries(options)) {
      target.setAttribute(p, v)
    }
  }
  customDialog.prototype.mutate = function (target) {
    target.addEventListener("click", () => {
      this.hide()
      this.destroy()
    }, false)
    return
  }
  customDialog.prototype.create = function () {
    this.setAssets(this.$el, {
      "class": this.dialogType,
      "id": this.dialogId(),
      "data-modifier": this.modifier
    })
    this.$el.innerHTML = this.content.toString()
    this.mutate(this.$el)
    document.querySelector(this.parent).appendChild(this.$el)
    return
  }
  customDialog.prototype.destroy = function () {
    this.$el.remove()
    return
  }
  customDialog.prototype.show = function () {
    this.$el.classList.add('displayed')
    return
  }
  customDialog.prototype.hide = function () {
    this.$el.classList.remove('displayed')
    return
  }
  return customDialog
})()

var toastCustomDialog = (function (CustomDialog) {
  __extends(toastCustomDialog, CustomDialog)

  function toastCustomDialog(options = {}) {
    CustomDialog.call(this)
    Object.assign(this, {
      dialogType: "toast",
      parent: "body",
      hiderCounter: 5e3,
    }, options)
  }
  toastCustomDialog.prototype.getNextTop = function () {
    if (document.body.contains(document.querySelector(".toast"))) {
      var toasts = document.querySelectorAll(".toast")
      return toasts[toasts.length - 1].offsetTop + toasts[toasts.length - 1].clientHeight
    }
    return 0
  }
  toastCustomDialog.prototype.createCloseBtn = function (target) {
    var closeButton = document.createElement("span")
    this.setAssets(target, {
      "data-top": this.getNextTop()
    })
    this.setAssets(closeButton, {
      "class": "state-modifier",
      "data-state": "hide",
      "data-target": target.getAttribute("id")
    })
    closeButton.addEventListener("click", () => {
      var elHide = new Promise((resolve) => {
        this.hide()
        resolve(true)
      })
      elHide.then(this.destroy())
    }, false)
    target.prepend(closeButton)
  }
  toastCustomDialog.prototype.mutate = function (target) {
    var sT
    this.createCloseBtn(target)
    var elHide = new Promise((resolve) => {
      sT = setTimeout(() => {
        this.hide()
        resolve(true)
      }, this.hiderCounter)
    })
    elHide.then(() => {
      this.destroy()
    }).finally(() => {
      clearTimeout(sT)
    })
    return
  }
  return toastCustomDialog
})(customDialog)


var windowCustomDialog = (function (toastCustomDialog) {
  __extends(windowCustomDialog, toastCustomDialog)

  function windowCustomDialog(options = {}) {
    toastCustomDialog.call(this)
    Object.assign(this, {
      dialogType: "window",
      parent: ".overlay"
    }, options)
  }
  windowCustomDialog.prototype.destroy = function () {
    document.querySelector(".overlay").innerHTML = ""
    return
  }
  windowCustomDialog.prototype.createOverlay = function (target) {
    if (document.body.contains(document.querySelector(".overlay"))) {
      document.querySelector(".overlay").classList.remove('hidden')
    } else {
      var windowOverlay = document.createElement("div")
      this.setAssets(windowOverlay, {
        "class": "overlay"
      })
      document.querySelector("body").appendChild(windowOverlay)
      document.querySelector("html").classList.add('noscroll')
      windowOverlay.addEventListener("click", (e) => {
        if (!e.target.classList.contains("window")) {this.hide()}
      }, false)
    }
    return
  }
  windowCustomDialog.prototype.mutate = function (target) {
    this.createCloseBtn(target)
    this.createOverlay(target)
    return
  }
  windowCustomDialog.prototype.hide = function () {
    var elHide = new Promise((resolve, reject) => {
      this.$el.classList.remove('displayed')
      document.querySelector(".overlay").classList.add('hidden')
      document.querySelector("html").classList.remove('noscroll')
      resolve(true)
    })
    elHide.finally(() => {
      this.destroy()
    })
    return
  }
  return windowCustomDialog
})(toastCustomDialog)
