import $ from 'jquery'

import center from 'center'

$(() => {
    let inputs = $('input').toArray()
    $('#start').click(() => {
        $('#intro').fadeOut(() => {
            $('#questions').fadeIn()
        })
    })
    $('#more').click(() => {
        let newgroup = $('#fuckup-group').clone()
        let newnum = inputs.length - 2
        newgroup.prop('id', 'fuckup-group' + newnum)
        newgroup.hide()
        let label = newgroup.children().first()
        label.prop('for', 'fuckup' + newnum)
        label.text('What else did you do?')
        let input = newgroup.children().last()
        input.prop('id', label.prop('for'))
        input.val('')
        inputs.push(input)
        $('#more').before(newgroup)
        newgroup.fadeIn()
        if (inputs.length > 5) {
            $('#more').hide()
        }
    })
    $(document).on('keyup', 'input', () => {
        $('#generate').prop('disabled', (
            inputs.filter(
                (input) => input.value.trim().length == 0
            ).length > 0
        ))
    })
    $('#generate').click(() => {
        $('#questions').fadeOut(() => {
            let canvas = $('<canvas/>')
            let windowHeight = $(window.top).height()
            let windowWidth = $(window.top).width()
            let targetAspect = 8.5 / 11.0
            let canvasHeight, canvasWidth
            if ((windowWidth / windowHeight) > targetAspect) {
                canvasHeight = (windowHeight * 0.95)
                canvasWidth = canvasHeight * targetAspect
            }
            else {
                canvasWidth = (windowWidth * 0.95)
                canvasHeight = canvasWidth / targetAspect
            }
            canvas.width(canvasWidth).height(canvasHeight)
            canvas.css('background-color', 'red')
            $('body').append(canvas)
            canvas = canvas.get()[0]
            center(canvas)
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            let text = [
                ['Dear ', $('#fuckee').val().trim(), ','],
                [
                    'I am deeply sorry that ',
                    $('#fuckup').val().trim(),
                    'I know it was my fault. ',
                    'I never meant for that to happen. ',
                    'I never dreamed it could.'
                ],
                ['I hope you feel the same way.'],
                ['I mean this. I mean every word.'],
                [$('#fucker').val().trim()]
            ]

            text[1][1] = appendPeriod(text[1][1])

            let first = true
            for (let i of [5, 4, 3, 2, 1]) {
                let elem = $('#fuckup' + i)
                if (elem.length) {
                    text[2].splice(0, 0, elem.val().trim())
                    if (first) {
                        text[2][0] = appendPeriod(text[2][0])
                        first = false
                    }
                    else {
                        text[2][0] += ' '
                    }
                    text[2].splice(
                        0, 0, (
                            i == 1 ?
                            'I am also sorry that ' :
                            'and that '
                        )
                    )
                }
            }

            let ctx = canvas.getContext('2d')
            ctx.font = '25px'
            let y = 20
            for (let arr of text) {
                let lines = splitLines(arr.join(''), ctx, canvas.width)
                for (let line of lines) {
                    ctx.fillText(line, 10, y)
                    y += 25
                }
            }
        })
    })
    // FAKE CODE
    $('#start').click()
    setTimeout(() => {
        $('#fucker').val('Fucker')
        $('#fuckee').val('Fuckee')
        $('#fuckup').val('Fuckup')
        $('#more').click()
        $('#more').click()
        $('#more').click()
        setTimeout(() => {
            $('#fuckup1').val('Fuckup1')
            $('#fuckup2').val('Fuckup2')
            $('#fuckup3').val('Fuckup3')
            $('#generate').click()
        }, 1000)
    }, 1000)

    function appendPeriod(text) {
        if (!text.endsWith('.')) {
            text += '.'
        }
        text += ' '
        return text
    }

    function splitLines(text, ctx, width) {
        let lines = ['']
        for (let word of text.split(' ')) {
            let lastLine = lines[lines.length - 1]
            if (lastLine.length == 0) {
                lines[lines.length - 1] = word
            }
            else {
                let potentialLine = lastLine
                potentialLine += ' ' + word
                if (ctx.measureText(potentialLine).width > width) {
                    lines.push(word)
                }
                else {
                    lines[lines.length - 1] = potentialLine
                }
            }
        }
        return lines
    }
})
