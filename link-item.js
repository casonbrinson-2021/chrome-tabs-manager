class LinkItem extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.innerHTML = `
            <p>LinkItem Component</p>
        `
    }
}

customElements.define('link-item', LinkItem)
