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
            let fontSize = 30
            let lines = []
            while (true) {
                lines = []
                fontSize++
                ctx.font = fontSize + 'px sans-serif'
                for (let arr of text) {
                    lines = lines.concat(splitLines(
                        arr.join(''),
                        ctx,
                        canvas.width - (fontSize * 3)
                    ))
                    lines.push('')
                }
                lines.splice(lines.length - 1, 1)
                lines.splice(lines.length - 2, 1)
                if (
                    (lines.length * fontSize * 1.1) >
                    (
                        canvas.height -
                        (fontSize * 1.5) -
                        ((fontSize * 1.1) + 50)
                    )
                ) {
                    fontSize--
                    ctx.font = fontSize + 'px sans-serif'
                    break
                }
            }
            let y = fontSize * 1.5
            let x = fontSize * 1.5
            let waitTime = 20000 / [].concat.apply([], text).join('').length
            let line = 0, letter = 0, delta = 0, lastFrameTime = 0
            let tick = (timestamp) => {
                ctx.font = fontSize + 'px sans-serif'
                let done = false
                if (lastFrameTime != 0) {
                    delta += timestamp - lastFrameTime
                    while (delta >= waitTime) {
                        delta -= waitTime
                        ctx.fillText(lines[line].charAt(letter), x, y)
                        x += ctx.measureText(lines[line].charAt(letter)).width
                        letter++
                        if (lines[line].charAt(letter) == ' ') {
                            x += ctx.measureText(
                                lines[line].charAt(letter)
                            ).width
                            letter++
                        }
                        if (letter >= lines[line].length) {
                            letter = 0
                            x = fontSize * 1.5
                            line++
                            y += fontSize * 1.1
                            if (
                                (line < lines.length) &&
                                (lines[line].length == 0)
                            ) {
                                line++
                                y += fontSize * 1.1
                            }
                        }
                        if (line >= lines.length) {
                            done = true
                        }
                    }
                }
                lastFrameTime = timestamp
                if (done) {
                    ctx.font = '12px serif'
                    ctx.moveTo(fontSize * 1.5, y)
                    ctx.lineTo((fontSize * 1.5) + 150, y)
                    y += 18
                    ctx.fillText(
                        'Like this card?  Visit us at',
                        fontSize * 1.5,
                        y
                    )
                    y += 14
                    ctx.fillText('www.apologies4men.com!', fontSize * 1.5, y)
                    y += 10
                    ctx.moveTo(fontSize * 1.5, y)
                    ctx.lineTo((fontSize * 1.5) + 150, y)
                    ctx.stroke()
                }
                else {
                    requestAnimationFrame(tick)
                }
            }
            requestAnimationFrame(tick)
        })
    })
    // FAKE CODE
    $('#start').click()
    setTimeout(() => {
        $('#fucker').val('Fucker')
        $('#fuckee').val('Fuckee')
        $('#fuckup').val('Some very long peice of text that will take up space')
        $('#more').click()
        $('#more').click()
        $('#more').click()
        setTimeout(() => {
            $('#fuckup1').val('This is a lot of text')
            $('#fuckup2').val('This is a very long piece of text to fill up space')
            $('#fuckup3').val('This is yet another super long piece of text')
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
