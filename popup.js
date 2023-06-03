/*remove later*/
//----------------------------------------------------
// const favoritesLinksData = [
//   {
//       url: 'https://youtube.com',
//       name: 'YouTube',
//       id: 1,
//   },
//   {
//       url: 'https://google.com',
//       name: 'Google',
//       id: 2,
//   },
//   {
//       url: 'https://casonswebsite.com',
//       name: 'Cason\'s Website',
//       id: 3,
//   },
// ]

// const favoritesFoldersData = [
//   {
//       folderName: 'Folder 1',
//       id: 4,
//       links: [
//           {
//               url: 'https://google.com',
//               name: 'Google',
//               id: 5,
//           },
//           {
//               url: 'https://youtube.com',
//               name: 'YouTube',
//               id: 6,
//           }
//       ]
//   },
//   {
//       folderName: 'Folder 2',
//       id: 7,
//       links: [
//           {
//             url: 'https://youtube.com',
//             name: 'YouTube',
//             id: 8,
//           },
//           {
//               url: 'https://google.com',
//               name: 'Google',
//               id: 9,
//           }
//       ]
//   }
// ]

// const tabGroupsData = [
//   {
//       name: 'Group Name',
//       id: 10,
//       links: [
//           'https://youtube.com',
//           'https://google.com',
//       ]
//   },
//   {
//       name: 'Another Group Name',
//       id: 11,
//       links: [
//         'https://google.com',
//         'https://youtube.com',
//       ]
//   }
// ]

// //set stuff up in local storage
// localStorage.setItem('favoritesFoldersData', JSON.stringify(favoritesFoldersData))
// localStorage.setItem('tabGroupsData', JSON.stringify(tabGroupsData))
// localStorage.setItem('favoritesLinksData', JSON.stringify(favoritesLinksData))

const tgd = JSON.parse(localStorage.getItem('tabGroupsData'))
const ffd = JSON.parse(localStorage.getItem('favoritesFoldersData'))
const fld = JSON.parse(localStorage.getItem('favoritesLinksData'))

//----------------------------------------------------

//helper functions
const openUrlInNewWindow = (url) => window.open(url, '_blank').focus()
const openTabGroup = async (urlList, groupName) => {
  const newTabIds = []
  for(let i = 0; i < urlList.length; i++) {
    const newTab = await chrome.tabs.create({url: urlList[i], active: false})
    newTabIds.push(newTab.id)
  }

  const groupId = await chrome.tabs.group({ tabIds: newTabIds })
  await chrome.tabGroups.update(groupId, { title: groupName, color: 'blue' })
}
const deleteTabGroup = (id) => {
  const tabGroupsFromStorage = JSON.parse(localStorage.getItem('tabGroupsData'))

  const newTabGroups = tabGroupsFromStorage.filter((elem) => elem.id !== id)

  localStorage.setItem('tabGroupsData', JSON.stringify(newTabGroups))

  document.querySelector('.tab-groups-list-container').innerHTML = ''
  populateTabGroups()
}
const clickAddTabGroupButton = async () => {
  const openGroups = await chrome.tabGroups.query({})
  
  //add groups to local storage to save them
  const newGroupsList = []
  for(let i = 0; i < openGroups.length; i++) {
    const currGroup = openGroups[i]
    const tabs = await chrome.tabs.query({groupId: currGroup.id})
    newGroupsList.push({name: currGroup.title, links: tabs.map(tab => tab.url), color: currGroup.color, id: Date.now()})
  }

  const tabGroupsFromStorage = JSON.parse(localStorage.getItem('tabGroupsData'))
  const updatedTabGroups = [...tabGroupsFromStorage, ...newGroupsList]
  localStorage.setItem('tabGroupsData', JSON.stringify(updatedTabGroups))

  document.querySelector('.tab-groups-list-container').innerHTML = ''
  populateTabGroups()
}
const checkIfGroupExistsAlready = () => {
  console.log('write me :p')
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
const deleteLinkFromFavoritesFolder = (linkId, folderId) => {
  const favoritesFoldersFromStorage = JSON.parse(localStorage.getItem('favoritesFoldersData'))

  const newFavoritesFolders = favoritesFoldersFromStorage.map((folder) => {
    if(folder.id === folderId) return { folderName: folder.folderName, id: folder.id, links: folder.links.filter((link) => link.id !== linkId) }
    return folder
  })

  localStorage.setItem('favoritesFoldersData', JSON.stringify(newFavoritesFolders))

  document.querySelector('.favorites-list-container').innerHTML = ''
  populateFavoritesFolders([folderId])
  populateFavoritesLinks()
}

/* step 1 - populate tab groups data into the right spots and create all event handlers and logic for it */
const populateTabGroups = () => {
  const tabGroupsListElem = document.querySelector('.tab-groups-list-container')
  JSON.parse(localStorage.getItem('tabGroupsData')).forEach(tabGroupInfo => {
    //create the tab group
    const tabGroupContainer = document.createElement('div')
    tabGroupContainer.classList.add('tab-group-container')
    tabGroupContainer.innerHTML = `
      <div class="tab-group">
        <div class="tab-group-title-container">
          <div class="emoji-container"><span class="emoji">&#128516;</span></div>
          <p class="tab-group-title">${tabGroupInfo.name}</p>
        </div>
        <p class="tab-group-count">${tabGroupInfo.links.length} tabs</p>
      </div>
      <img src="./trash-icon.svg" class="trash-icon invisible"/>
    `

    //add any event handlers needed
    const tabGroup = tabGroupContainer.querySelector('.tab-group')
    tabGroup.querySelector('.emoji-container').addEventListener('click', openEmojiPicker)
    tabGroup.addEventListener('click', () => openTabGroup(tabGroupInfo.links, tabGroupInfo.name))
    tabGroupContainer.querySelector('.trash-icon').addEventListener('click', () => deleteTabGroup(tabGroupInfo.id))

    //add the tab group to the list 
    tabGroupsListElem.appendChild(tabGroupContainer)
  })
}
populateTabGroups()

/* step 2 - populate favorites data into the right spots and create all event handlers and logic for it */
const populateFavoritesFolders = (openFolderIds = []) => {
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
      const container = document.createElement('div')
      container.classList.add('link-container', 'sub-link')
      container.innerHTML = `
        <p class="link">${linkInfo.name}</p>
        <img src="./trash-icon.svg" class="trash-icon hidden"/>
      `
      container.querySelector('.link').addEventListener('click', () => openUrlInNewWindow(linkInfo.url))
      container.querySelector('.trash-icon').addEventListener('click', () => deleteLinkFromFavoritesFolder(linkInfo.id, folderInfo.id))

      if (openFolderIds.includes(folderInfo.id)) folderContent.classList.add('open-folder')

      //add the link to the folder content
      folderContent.appendChild(container)
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
const addFavoriteButton = document.querySelector('.add-favorite')
// addFavoriteButton.addEventListener('mouseenter', () => document.querySelector('.add-icon-hover-text-container').classList.toggle('hidden'))
// addFavoriteButton.addEventListener('mouseleave', () => document.querySelector('.add-icon-hover-text-container').classList.toggle('hidden'))

addFavoriteButton.addEventListener('click', clickAddFavoriteButton)

const addTabGroupButton = document.querySelector('.add-tab-group')
addTabGroupButton.addEventListener('click', clickAddTabGroupButton)

//add listeners to the popup buttons (add and cancel)
document.querySelector('.cancel-button').addEventListener('click', closeAddFavoritePopup)
document.querySelector('.add-button').addEventListener('click', addLinkToFavorites)

//add listener for the close button for the whole thing
document.querySelector('.close-icon-container').addEventListener('click', () => window.close())







