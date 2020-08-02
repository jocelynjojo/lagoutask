// TODO: site logics

$(($) => {
  const $body = $('html, body')
console.log('welcome')
  $('#scroll_top').on('click', () => {
    $body.animate({ scrollTop: 0 }, 600)
    return false
  })
})
