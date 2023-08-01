const video = document.querySelector('.video')
        const muted = document.getElementById('muted')
        video.controls = false
        muted.onclick = function () {
            if (video.muted) {
                video.muted = false
                muted.classList.remove('fa-volume-xmark')
                muted.classList.add('fa-volume-high')
            }
            else {
                video.muted = true

                muted.classList.remove('fa-volume-high')
                muted.classList.add('fa-volume-xmark')
            }
        }
        video.ended = function () {
            video.currentime = 0
            video.play()
        }
        const display = document.querySelector('#display')
        const form = document.querySelector('.form')
        display.onclick = function () {
            if (form.style.display == 'block') {
                display.classList.remove('fa-eye')
                display.classList.add('fa-eye-slash')
                form.style.display = 'none'
            }
            else {
                display.classList.remove('fa-eye-slash')
                display.classList.add('fa-eye')
                form.style.display = 'block'
            }
        }