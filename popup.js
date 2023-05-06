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

const tgd = JSON.parse(localStorage.getItem('tabGroupsData'))
const ffd = JSON.parse(localStorage.getItem('favoritesFoldersData'))

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

//elements I might need
const tabGroupsListElem = document.querySelector('.tab-groups-list-container')
const favoritesListElem = document.querySelector('.favorites-list-container')

/* step 1 - populate tab groups data into the right spots and create all event handlers and logic for it */
tgd.forEach(tabGroupInfo => {
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

/* step 2 - populate favorites data into the right spots and create all event handlers and logic for it */
ffd.forEach(folderInfo => {
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









