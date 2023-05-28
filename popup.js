/*remove later*/
//----------------------------------------------------
// const favoritesLinksData = [
//   {
//       url: 'https://youtube.com',
//       name: 'YouTube'
//   },
//   {
//       url: 'https://google.com',
//       name: 'Google'
//   },
//   {
//       url: 'https://casonswebsite.com',
//       name: 'Cason\'s Website'
//   },
// ]

// const favoritesFoldersData = [
//   {
//       folderName: 'Folder 1',
//       links: [
//           {
//               url: 'https://google.com',
//               name: 'Google',
//           },
//           {
//               url: 'https://youtube.com',
//               name: 'YouTube',
//           }
//       ]
//   },
//   {
//       folderName: 'Folder 2',
//       links: [
//           {
//             url: 'https://youtube.com',
//             name: 'YouTube',
//           },
//           {
//               url: 'https://google.com',
//               name: 'Google',
//           }
//       ]
//   }
// ]

// const tabGroupsData = [
//   {
//       name: 'Group Name',
//       links: [
//           'https://youtube.com',
//           'https://google.com',
//       ]
//   },
//   {
//       name: 'Another Group Name',
//       links: [
//         'https://google.com',
//         'https://youtube.com',
//       ]
//   }
// ]

//set stuff up in local storage
// localStorage.setItem('favoritesFoldersData', JSON.stringify(favoritesFoldersData))
// localStorage.setItem('tabGroupsData', JSON.stringify(tabGroupsData))
// localStorage.setItem('favoritesLinksData', JSON.stringify(favoritesLinksData))

const tgd = JSON.parse(localStorage.getItem('tabGroupsData'))
const ffd = JSON.parse(localStorage.getItem('favoritesFoldersData'))
const fld = JSON.parse(localStorage.getItem('favoritesLinksData'))

//----------------------------------------------------

//helper functions
const openUrlInNewWindow = (url) => window.open(url, '_blank').focus()
const openTabGroup = (urlList) => {
  urlList.forEach(url => chrome.tabs.create({url: url}))
}
const openEmojiPicker = (e) => {
    e.stopPropagation()
    console.log('opening emoji picker')
}
const clearAddPopupInputFields = () => {
  document.querySelector('.popup-name-input').value = ''
  document.querySelector('.popup-url-input').value = ''
}
const clickAddFavoriteButton = async () => {
  clearAddPopupInputFields()
  document.querySelector('.add-popup').classList.toggle('hidden')
  document.querySelector('.popup-background-blocker').classList.toggle('hidden')
}
const closeAddFavoritePopup = () => {
  clearAddPopupInputFields()
  document.querySelector('.add-popup').classList.toggle('hidden')
  document.querySelector('.popup-background-blocker').classList.toggle('hidden')
}
const addLinkToFavorites = () => {
  //for getting the current tab url and stuff --reference--
  // let queryOptions = { active: true, currentWindow: true }
  // let [tab] = await chrome.tabs.query(queryOptions)
  // const favoritesLinksFromStorage = JSON.parse(localStorage.getItem('favoritesLinksData'))
  // const newFavoritesLinks = [{url: tab.url, name: tab.url}, ...favoritesLinksFromStorage]
  // localStorage.setItem('favoritesLinksData', JSON.stringify(newFavoritesLinks))

  const name = document.querySelector('.popup-name-input').value
  const url = document.querySelector('.popup-url-input').value
  const id = Date.now()

  const favoritesLinksFromStorage = JSON.parse(localStorage.getItem('favoritesLinksData'))
  const newFavoritesLinks = [...favoritesLinksFromStorage, {url, name, id}]
  localStorage.setItem('favoritesLinksData', JSON.stringify(newFavoritesLinks))

  document.querySelector('.favorites-list-container').innerHTML = ''
  populateFavoritesFolders()
  populateFavoritesLinks()

  closeAddFavoritePopup()
}
const deleteLinkFromFavorites = (id) => {
  const favoritesLinksFromStorage = JSON.parse(localStorage.getItem('favoritesLinksData'))

  const newFavoritesLinks = favoritesLinksFromStorage.filter((elem) => elem.id !== id)

  localStorage.setItem('favoritesLinksData', JSON.stringify(newFavoritesLinks))

  document.querySelector('.favorites-list-container').innerHTML = ''
  populateFavoritesFolders()
  populateFavoritesLinks()
}

/* step 1 - populate tab groups data into the right spots and create all event handlers and logic for it */
const populateTabGroups = () => {
  const tabGroupsListElem = document.querySelector('.tab-groups-list-container')
  JSON.parse(localStorage.getItem('tabGroupsData')).forEach(tabGroupInfo => {
    //create the tab group
    const tabGroup = document.createElement('div')
    tabGroup.classList.add('tab-group')
    tabGroup.innerHTML = `
      <div class="tab-group-title-container">
        <div class="emoji-container"><span class="emoji">&#128516;</span></div>
        <p class="tab-group-title">${tabGroupInfo.name}</p>
      </div>
      <p class="tab-group-count">${tabGroupInfo.links.length} tabs</p>
    `

    //add any event handlers needed
    tabGroup.querySelector('.emoji-container').addEventListener('click', openEmojiPicker)
    tabGroup.addEventListener('click', () => openTabGroup(tabGroupInfo.links))

    //add the tab group to the list 
    tabGroupsListElem.appendChild(tabGroup)
  })
}
populateTabGroups()

/* step 2 - populate favorites data into the right spots and create all event handlers and logic for it */
const populateFavoritesFolders = () => {
  const favoritesListElem = document.querySelector('.favorites-list-container')
  JSON.parse(localStorage.getItem('favoritesFoldersData')).forEach(folderInfo => {  
    //create the folder
    const folder = document.createElement('div')
    folder.classList.add('folder')
    folder.innerHTML = `
      <div class="folder-title-container">
        <p class="link-folder">${folderInfo.folderName}</p>
        <img src="./dropdown-icon.svg" class="dropdown-icon"/>
      </div>
    `

    //create the folder content
    const folderContent = document.createElement('div')
    folderContent.classList.add('folder-content')
    folderInfo.links.forEach(linkInfo => {
      //create the link
      const link = document.createElement('p')
      link.classList.add('sub-link', 'link')
      link.innerText = `${linkInfo.name}`
      link.addEventListener('click', () => openUrlInNewWindow(linkInfo.url))

      //add the link to the folder content
      folderContent.appendChild(link)
    })

    //add event listeners to folder title
    const folderTitle = folder.querySelector('.folder-title-container')
    folderTitle.addEventListener('click', () => {
      folderTitle.querySelector('.dropdown-icon').classList.toggle('expanded')
      const isExpanded = folderContent.style.display === 'block'
      folderContent.style.display = isExpanded ? 'none' : 'block'
    })

    //add the folderContent to the folder
    folder.appendChild(folderContent)
    //add the folder to the folder list
    favoritesListElem.appendChild(folder)
  })
}
populateFavoritesFolders()

/* step 3 populate favorites links data into the right spots and create all event handlers and logic for it */
const populateFavoritesLinks = () => {
  const favoritesListElem = document.querySelector('.favorites-list-container')
  JSON.parse(localStorage.getItem('favoritesLinksData')).forEach(linkInfo => {
    const container = document.createElement('div')
    container.classList.add('link-container')
    container.innerHTML = `
      <p class="link">${linkInfo.name}</p>
      <img src="./trash-icon.svg" class="trash-icon hidden"/>
    `
    container.querySelector('.link').addEventListener('click', () => openUrlInNewWindow(linkInfo.url))
    container.querySelector('.trash-icon').addEventListener('click', () => deleteLinkFromFavorites(linkInfo.id))
    favoritesListElem.appendChild(container)
  })
}
populateFavoritesLinks()

//add new favorite button and listeners for it
const addFavoriteButton = document.querySelector('.add-icon')
addFavoriteButton.addEventListener('mouseenter', () => document.querySelector('.add-icon-hover-text-container').classList.toggle('hidden'))
addFavoriteButton.addEventListener('mouseleave', () => document.querySelector('.add-icon-hover-text-container').classList.toggle('hidden'))

addFavoriteButton.addEventListener('click', clickAddFavoriteButton)

//add listeners to the popup buttons (add and cancel)
document.querySelector('.cancel-button').addEventListener('click', closeAddFavoritePopup)
document.querySelector('.add-button').addEventListener('click', addLinkToFavorites)

//add listener for the close button for hte whole thing
document.querySelector('.close-icon-container').addEventListener('click', () => window.close())







