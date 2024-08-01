let date_now = ''
let date_before = ''
let date_slowdown_array = []
let date_slowdown_array_index = 0
let date_slowdown_treshold = 5
let slowdown_popup_show = pixelbite.parallaxEffect.slowdownShowPopup || "true"
let slowdown_popup_showed = false
let slowdown_slowdown = pixelbite.parallaxEffect.slowdown || "true"

document.addEventListener('mousemove', e => {
    date_before = date_now
    date_now = Date.now()
    date_slowdown_array[date_slowdown_array_index % date_slowdown_treshold] = date_now - date_before
    date_slowdown_array_index++

    let slowdown = 0
    for (let i = 0; i < date_slowdown_array.length; i++) {
        if (date_slowdown_array[i] > 120) {
            slowdown++
        }
    }

    if (slowdown < date_slowdown_treshold || slowdown_slowdown === "false") {
        if (document.getElementsByClassName('parallax')) {
            for (let i = 0; i < document.getElementsByClassName('parallax').length; i++) {
                let element = document.getElementsByClassName('parallax')[i]
                element.classList.add('parallaxEffectContainer')
                let layers = element.getElementsByClassName('parallaxLayer')
                for (let j = 0; j < layers.length; j++) {
                    let layer = layers[j]
                    let parallaxPlier = 0.01
                    if (layer.getAttribute('parallax')) {
                        parallaxPlier = layer.getAttribute('parallax')
                    }
                    let parallaxPerspective = 600000
                    if (layer.getAttribute('perspective')) {
                        parallaxPerspective = layer.getAttribute('perspective')
                    }
                    let width = window.innerWidth/2;
                    let height = window.innerHeight/2;
                    let mouseX = e.clientX;
                    let mouseY = e.clientY;
                    let posX = (mouseX - width) * parallaxPlier
                    let posY = (mouseY - height) * parallaxPlier
                    let caclX = posX * 2
                    let calcY = posY * -2
                    let perspective = parallaxPlier * parallaxPerspective
                    layer.style.left = posX + '%'
                    layer.style.top = posY + '%'
                    layer.style.transform = "perspective(" + perspective + "px) rotateY(" + caclX + "deg) rotateX(" + calcY + "deg)"
                    // perspective(800px)
                    // rotateY(-8deg);
                }
            }
        }
    } else if (slowdown_popup_show !== 'false') {
        if (!slowdown_popup_showed) {
            let warning = document.createElement('div')
            warning.classList = 'w-100% foreach:ff-monospace pos-fixed bottom-0 left-0 p-18px zIndex-99 bg-warning flexSpaceBetween flexRow'
            warning.id = 'parallaxWarningPopup'
            warning.innerHTML = '<div class="fw-800">parallaxEffect: Warning! Config "parallaxEffect" was influencing website slowdown and disabled itself. To avoid this warning popup, please add to your config <span class="bg-rgba(0,0,0,.2) p-4px-6px br-3px">parallaxEffect = {slowdownShowPopup: "false"}</span></div><div class="bg-rgba(0,0,0,.3) hover:bg-rgba(0,0,0,.5) fw-900 c-warning h-20px w-26px pb-2px br-100px fs-12px flex pointer flexCenter flexMiddle" onclick="document.getElementById(\'parallaxWarningPopup\').remove()">x</div>'
            document.body.appendChild(warning);
            slowdown_popup_showed = true
            refresh()
        }
    }
})