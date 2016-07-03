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
            $('#loading').fadeIn(fadeMessage)
        })
    })
    let loadingMessages = [
        'Loading Social Matrix...',
        'Reticulating Splines...',
        'Optimizing Verbiage...'
    ]
    let fadeMessage = () => {
        if (loadingMessages.length) {
            $('#message').fadeOut(1500, () => {
                $('#message')
                    .text(loadingMessages.shift())
                    .fadeIn(fadeMessage)
            })
        }
        else {
            $('#loading').fadeOut(1500, draw)
        }
    }
    let draw = () => {
        let canvas = $('<canvas/>')
        let overlay = $('<div/>')
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
        overlay.width(canvasWidth).height(canvasHeight)
        overlay.css('opacity', '0')
        canvas.width(canvasWidth).height(canvasHeight)
        $('body').append(canvas)
        $('body').append(overlay)
        canvas = canvas.get()[0]
        center(canvas)
        center(overlay.get()[0])
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let text = ''
        let inputRanges = []

        text += 'Dear '
        text = appendInput(text, 'fuckee', inputRanges)
        text += ',\n\nI am deeply sorry that '
        text = appendInput(text, 'fuckup', inputRanges)
        text = appendPeriod(text)
        text += 'I know it was my fault. '
        text += 'I never meant for that to happen. '
        text += 'I never dreamed it could.\n\n'
        if ($('#fuckup1').length) {
            text += 'I am also sorry that '
            text = appendInput(text, 'fuckup1', inputRanges)
            for (let i of [2, 3, 4, 5]) {
                if ($('#fuckup' + i).length) {
                    text += ' and that '
                    text = appendInput(text, 'fuckup' + i, inputRanges)
                }
            }
            text = appendPeriod(text)
        }
        text += 'I hope you feel the same way.\n\n'
        text += 'I mean this. I mean every word.\n'
        text = appendInput(text, 'fuckee', inputRanges)

        let ctx = canvas.getContext('2d')
        let fontSize = 10
        let commands = generateCommands(
            fontSize,
            text,
            canvas.width,
            canvas.height,
            ctx,
            inputRanges
        )
        while (true) {
            fontSize++
            let potentialCommands = generateCommands(
                fontSize,
                text,
                canvas.width,
                canvas.height,
                ctx,
                inputRanges
            )
            if (
                potentialCommands[potentialCommands.length - 1].y >
                (canvas.height - fontSize - 50)
            ) {
                fontSize--
                break
            }
            else {
                commands = potentialCommands
            }
        }

        let waitTime = 0, delta = 0, lastFrameTime = 0
        let tick = (timestamp) => {
            if (lastFrameTime != 0) {
                delta += timestamp - lastFrameTime
                while (delta >= waitTime) {
                    delta -= waitTime
                    let command = commands.shift()
                    command.render(ctx)
                }
            }
            if (commands.length) {
                lastFrameTime = timestamp
                waitTime = commands[0].delay
                requestAnimationFrame(tick)
            }
            else {
                overlay.remove()
            }
        }
        requestAnimationFrame(tick)
    }
    // FAKE CODE
    $('#start').click()
    setTimeout(() => {
        $('#fucker').val('Fucker')
        $('#fuckee').val('Fuckee')
        $('#fuckup').val('Some very long piece of text that will take up space')
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

    function generateCommands(
        fontSize, text, width,
        height, ctx, inputRanges
    ) {
        let margin = fontSize * 1.5
        let commands = []
        let x = margin
        let y = margin + fontSize
        let baseDelay = 30000 / text.length
        ctx.font = fontSize + 'px sans-serif'
        for (let i = 0; i < text.length; i++) {
            let letter = text[i]
            if (letter == '\n') {
                y += fontSize * 1.1
                x = margin
            }
            else if (letter == ' ') {
                let widthOfNextWord = 0
                let j = 1
                while (
                    (i + j < text.length) &&
                    (text[i + j] != ' ') &&
                    (text[i + j] != '\n')
                ) {
                    widthOfNextWord += ctx.measureText(text[i + j]).width
                    j++
                }
                if ((x + widthOfNextWord) > (width - margin)) {
                    y += fontSize * 1.1
                    x = margin
                }
                else {
                    x += ctx.measureText(letter).width
                }
            }
            else {
                let yCopy = y
                let xCopy = x
                let delay = baseDelay
                if (isInput(i, inputRanges)) {
                    yCopy -= 2
                    delay += (Math.random() * 2 * delay)
                }
                commands.push({
                    y: yCopy,
                    render: (context) => {
                        context.font = fontSize + 'px sans-serif'
                        context.fillText(letter, xCopy, yCopy)
                    },
                    delay: delay
                })
                x += ctx.measureText(letter).width
            }
        }
        commands.push({
            y: y,
            delay: baseDelay,
            render: (context) => {
                let yCopy = height - 50
                context.font = '12px serif'
                context.moveTo(margin, yCopy)
                context.lineTo(margin + 150, yCopy)
                yCopy += 18
                context.fillText(
                    'Like this card?  Visit us at',
                    margin,
                    yCopy
                )
                yCopy += 14
                context.fillText('www.apologies4men.com!', margin, yCopy)
                yCopy += 10
                context.moveTo(margin, yCopy)
                context.lineTo(margin + 150, yCopy)
                context.stroke()
            }
        })
        return commands
    }

    function appendInput(text, inputName, inputRanges) {
        let value = $('#' + inputName).val().trim()
        inputRanges.push({ start: text.length, end: text.length + value.length})
        return text + value
    }

    function isInput(index, inputRanges) {
        for (let range of inputRanges) {
            if (index >= range.start && index < range.end) {
                return true
            }
        }
        return false
    }
})
