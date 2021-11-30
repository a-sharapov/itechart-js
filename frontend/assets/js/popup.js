'use strict'
// modifier: error|warning|success|default:info
class CustomDialog {
  constructor(options = {}) {
    Object.assign(this, {
      dialogType: "popup",
      $el: document.createElement("dialog"),
      content: "Содержимое данного блока не было заданно, его можно задать в соответвующем поле формы",
      parent: "main",
      modifier: "info"
    }, options)
  }
  dialogId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
  }
  setAssets(target, options) {
    for (const [p, v] of Object.entries(options)) {
      target.setAttribute(p, v)
    }
  }
  mutate(target) {
    target.addEventListener("click", () => {
      this.hide()
      this.destroy()
    }, false)
    void 0
  }
  create() {
    this.setAssets(this.$el, {
      "class": this.dialogType,
      "id": this.dialogId(),
      "data-modifier": this.modifier
    })
    this.$el.innerHTML = this.content.toString()
    this.mutate(this.$el)
    document.querySelector(this.parent).appendChild(this.$el)
    void 0
  }
  destroy() {
    this.$el.remove()
    void 0
  }
  show() {
    this.$el.classList.add('displayed')
    void 0
  }
  hide() {
    this.$el.classList.remove('displayed')
    void 0
  }
}

class ToastCustomDialog extends CustomDialog {
  constructor(options = {}) {
    super(options)
    Object.assign(this, {
      dialogType: "toast",
      parent: "body",
      hiderCounter: 5e3,
    }, options)
  }
  getNextTop() {
    if (document.body.contains(document.querySelector(".toast"))) {
      const toasts = document.querySelectorAll(".toast")
      return toasts[toasts.length-1].offsetTop + toasts[toasts.length-1].clientHeight
    }
    return 0
  }
  createCloseBtn(target) {
    const closeButton = document.createElement("span")
    this.setAssets(target, {
    "data-top": this.getNextTop()
    })
    this.setAssets(closeButton, {
      "class": "state-modifier",
      "data-state": "hide",
      "data-target": target.getAttribute("id")
    })
    closeButton.addEventListener("click", () => {
      const elHide = new Promise((resolve, reject) => {
        this.hide()
        resolve(true)
      })
      elHide.then(this.destroy())
    }, false)
    target.prepend(closeButton)
  }
  mutate(target) {
    let sT
    this.createCloseBtn(target)
    const elHide = new Promise((resolve, reject) => {
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
    void 0
  }
}

class WindowCustomDialog extends ToastCustomDialog {
  constructor(options = {}) {
    super(options)
    Object.assign(this, {
      dialogType: "window",
      parent: ".overlay"
    }, options)
  }
  destroy() {
    document.querySelector(".overlay").innerHTML = ""
    void 0
  }
  createOverlay(target) {
    if (document.body.contains(document.querySelector(".overlay"))) {
      document.querySelector(".overlay").classList.remove('hidden')
    } else {
      let windowOverlay = document.createElement("div")
      this.setAssets(windowOverlay, {
        "class": "overlay"
      })
      document.querySelector("body").appendChild(windowOverlay)
      document.querySelector("html").classList.add('noscroll')
      windowOverlay.addEventListener("click", () => {
        this.hide()
      }, false)
    }
  }
  mutate(target) {
    this.createCloseBtn(target)
    this.createOverlay(target)
    void 0
  }
  hide() {
    const elHide = new Promise((resolve, reject) => {
      this.$el.classList.remove('displayed')
      document.querySelector(".overlay").classList.add('hidden')
      document.querySelector("html").classList.remove('noscroll')
      resolve(true)
    })
    elHide.finally(() => {this.destroy()})
    void 0
  }
}