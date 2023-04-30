const favoritesLinksData = [
    {
        url: 'https://youtube.com',
        name: 'YouTube'
    },
    {
        url: 'https://google.com',
        name: 'Google'
    },
    {
        url: 'https://casonswebsite.com',
        name: 'Cason\'s Website'
    },
]
const favoritesFoldersData = [
    {
        folderName: 'Folder 1',
        links: [
            {
                url: 'https://google.com',
                name: 'Google',
            },
            {
                url: 'https://youtube.com',
                name: 'YouTube',
            }
        ]
    },
    {
        folderName: 'Folder 2',
        links: [
            {
                url: 'https://google.com',
                name: 'Google',
            },
            {
                url: 'https://youtube.com',
                name: 'YouTube',
            }
        ]
    }
]
const tabGroupsData = [
    {
        name: 'Group Name',
        links: [
            'https://youtube.com',
            'https://google.com',
        ]
    }
]

const openUrlInNewWindow = (url) => window.open(url, '_blank').focus()
const openTabGroup = (urlList) => console.log('opening tab group....\n', urlList.split(','))

const template = document.createElement('template')
template.innerHTML = `
    <link rel="stylesheet" href="tab-manager.css">

    <div class="container">
        <div class="section-container">
            <h2 class="section-title">Tab Groups</h2>
            <div class="tab-groups-list-container">
                ${tabGroupsData.map(tabGroup => `
                    <div class="tab-group" onclick="openTabGroup('${tabGroup.links}')">
                        <div class="tab-group-title-container">
                            <div class="emoji-container"><span>&#128516;</span></div>
                            <p class="tab-group-title">${tabGroup.name}</p>
                        </div>
                        <p class="tab-group-count">${tabGroup.links.length} tabs</p>
                    </div>
                `).join('\n')}
            </div>
        </div>

        <div class="section-container">
            <h2 class="section-title">Favorites</h2>
            <div class="favorites-list-container">
                ${favoritesLinksData.map(link => `
                    <p class="link" onclick="openUrlInNewWindow('${link.url}')">${link.name}</p>
                `).join('\n')}
                ${favoritesFoldersData.map(folder => `
                    <div class="link-folder-title-container">
                        <div class="emoji-container"><span>&#128516;</span></div>
                        <p class="link-folder">${folder.folderName}</p>
                        <img src="./dropdown-icon.svg" class="dropdown-icon"/>
                    </div>
                    <div class="link-folder-content">
                        ${folder.links.map(link => `<p class="sub-link link" onclick="openUrlInNewWindow('${link.url}')">${link.name}</p>`).join('\n')}
                    </div>
                `).join('\n')}
            </div>
        </div>
    </div>
`

class TabManager extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open'})
        this.shadow.append(template.content.cloneNode(true))
        this.shadow.querySelectorAll('.link-folder-title-container').forEach(folderElem=> {
            folderElem.addEventListener('click', () => {
                folderElem.querySelector('.dropdown-icon').classList.toggle('expanded')
                const sibling = folderElem.nextElementSibling
                const isExpanded = sibling.style.display === 'block'
                sibling.style.display = isExpanded ? 'none' : 'block'

            })
        })
    }
}

customElements.define('tab-manager', TabManager)