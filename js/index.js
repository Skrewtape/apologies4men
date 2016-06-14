import $ from 'jquery'

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
        inputs.push(input)
        $('#more').before(newgroup)
        newgroup.fadeIn()
        if (inputs.length > 5) {
            $('#more').prop('disabled', true)
        }
    })
    $(document).on('keyup', 'input', () => {
        $('#generate').prop('disabled', (
            inputs.filter(
                (input) => input.value.trim().length == 0
            ).length > 0
        ))
    })
})
