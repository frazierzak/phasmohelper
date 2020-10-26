function warning (message, bgcolor, color) {
	document.querySelector('.warning').setAttribute('style', `background-color: ${bgcolor}`)
	document.querySelector('.warning_text').textContent = message
	document.querySelector('.warning_text').setAttribute('style', `color: ${color}`)
}

function fadeout (div) {
	div.classList.remove('fadein', 'maybe', 'yes')
	div.classList.add('fadeout', 'disabled')
}

function fadein (div) {
	div.classList.remove('fadeout', 'disabled', 'yes')
	div.classList.add('fadein')
}

function toggle (el, inverted = false) {
  if (el.hasAttribute('style')) {
    if (inverted) {
      return el.setAttribute('style', 'display: none')
    }
    return el.setAttribute('style', 'display: block')
  }
  if (inverted) {
    return el.setAttribute('style', 'display: block')
  }
  el.setAttribute('style', 'display: none')
}

function getSiblings(el) {
  let siblings = [];
  let me = el
  el = el.parentNode.firstChild
  do {
    if (el.nodeType === 3 || el.nodeType === 8 || el === me) continue
    siblings.push(el)
  } while (el = el.nextSibling)
  return siblings
}

document.querySelector('#toggle_instructions').addEventListener('click', () => {
  document.querySelectorAll('.instructions').forEach(instructions => toggle(instructions, true))
})

document.querySelector('#toggle_descriptions').addEventListener('click', () => {
  document.querySelectorAll('.description').forEach(description => toggle(description))
})

document.querySelector('#toggle_minimal').addEventListener('click', () => {
  document.querySelectorAll('.minimal').forEach(minimal => toggle(minimal))
  document.querySelectorAll('.description').forEach(description => toggle(description))
})

document.querySelectorAll('.toggle_buttons a').forEach(button => {
	button.addEventListener('click', () => {
		button.classList.toggle('active')
	})
})

document.querySelector('#reset').addEventListener('click', () => {
	document.querySelectorAll('.ghost').forEach(ghost => {
		ghost.classList.remove('maybe', 'disabled', 'yes', 'fadein', 'fadeout')
	})
	document.querySelectorAll('.evidence li').forEach(evidence => {
		evidence.classList.remove('yes')
	})
	document.querySelector('#evidence li').classList.remove('disabled')
	document.querySelector('form').reset()
	warning('Please select up to 3 pieces of evidence to narrow down the spookster.', '#2f2f2f', '#fff')
})
document.querySelector('form').reset()

document.querySelectorAll('#evidence input').forEach(evidenceInput => {
  evidenceInput.addEventListener('change', () => {
    let numChecked = document.querySelectorAll('#evidence input[type="checkbox"]:checked').length
    let evidence = document.querySelectorAll(`ul.evidence > li.${evidenceInput.getAttribute('class')}`)

    if (numChecked > 3) {
      evidenceInput.checked = false
      warning('You\'ve already selected 3 pieces of evidence!', '#c61c1ce0', '#fff')
      return
    }

    if (evidenceInput.checked) {
      evidence.forEach(e => e.classList.add('yes'))
    } else {
      evidence.forEach(e => e.classList.remove('yes'))
    }
    
    switch (numChecked) {
      case 0:
        document.querySelectorAll('.evidence').forEach(e => {
          fadein(e.parentElement.parentElement)
          e.parentElement.parentElement.classList.remove('maybe')
        })
        warning('Please select up to 3 pieces of evidence to narrow down the spookster.', '#2f2f2f', '#fff')
        break
      case 1:
        document.querySelectorAll('.evidence').forEach(e => {
          let childrenLen = e.querySelectorAll('.yes').length
          if (childrenLen < 1) {
              fadeout(e.parentElement.parentElement)
            } else {
              fadein(e.parentElement.parentElement)
              e.parentElement.parentElement.classList.add('maybe')
            }
          })
          warning('Please select up to 2 more pieces of evidence to narrow down the spookster.', '#2f2f2f', '#fff')
          break
        case 2:
          document.querySelectorAll('.evidence').forEach(e => {
            let childrenLen = e.querySelectorAll('.yes').length
            if (childrenLen < 2) {
              fadeout(e.parentElement.parentElement)
            } else {
              fadein(e.parentElement.parentElement)
              e.parentElement.parentElement.classList.add('maybe')
            }
          })
          let maybe = document.querySelectorAll('.maybe')
          if (maybe.length === 1) {
            warning('Oh shit, a ghooost! Click the reset button above to start over.', '#55be61', '#000')
            maybe[0].classList.add('yes')
            maybe[0].classList.remove('maybe')
          } else {
            warning('Please select 1 more piece of evidence to identify the spookster.', '#2f2f2f', '#fff')
          }
          break
        case 3:
          document.querySelectorAll('.evidence').forEach(e => {
            if (e.querySelectorAll(':not(.yes)').length == 0) {
              fadein(e.parentElement.parentElement)
              e.parentElement.parentElement.classList.add('yes')
              e.parentElement.parentElement.classList.remove('maybe')
              getSiblings(e.parentElement.parentElement).forEach(sibling => fadeout(sibling))
              warning('Oh shit, a ghooost! Click the reset button above to start over.', '#55be61', '#000')
            }
          })
          if (document.querySelectorAll('#ghosts .yes').length == 0) {
            warning('No combination of evidence works!', '#c61c1ce0', '#fff')
            document.querySelectorAll('.ghost').forEach(ghost => fadeout(ghost))
          }
          break
    }
    //Remove incompatible evidence
    let evidence_left = []
    document.querySelectorAll('.maybe div .evidence').forEach(evidence => {
      evidence.querySelectorAll(':not(.yes)').forEach(no => {
        evidence_left.push(no.getAttribute('class'))
      })
    })
    if (numChecked >= 1){
      document.querySelectorAll('#evidence input[type="checkbox"]:not(:checked)').forEach(notChecked => {
        if (!evidence_left.includes(notChecked.getAttribute('id'))) {
          notChecked.parentElement.parentElement.classList.add('disabled')
        } else {
          notChecked.parentElement.parentElement.classList.remove('disabled')
        }
      })
    }
  })
})
