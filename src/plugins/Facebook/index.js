const Plugin = require('../../core/Plugin')
const { Provider } = require('../../server')
const { ProviderView } = require('../../views')
const { h } = require('preact')

module.exports = class Facebook extends Plugin {
    constructor (uppy, opts) {
        super(uppy, opts)
        this.type = 'acquirer'
        this.id = this.opts.id || 'Facebook'
        this.title = 'Facebook'
        this.icon = () => (
            <svg aria-hidden="true" class="UppyIcon UppyModalTab-icon" width="28" height="28" viewBox="0 0 512 512">
                <path d="M483.74,0H28.26A28.26,28.26,0,0,0,0,28.26V483.74A28.26,28.26,0,0,0,28.26,512H273.5V314H207V236.5h66.5v-57c0-66.13,40.39-102.14,99.38-102.14,28.25,0,52.54,2.1,59.62,3v69.11l-40.68,0c-32.1,0-38.32,15.25-38.32,37.64V236.5h76.74l-10,77.5H353.5V512H483.74A28.26,28.26,0,0,0,512,483.74V28.26A28.26,28.26,0,0,0,483.74,0Z" />
            </svg>
        )

        this[this.id] = new Provider(uppy, {
            host: this.opts.host,
            provider: 'facebook',
            authProvider: 'facebook'
        })

        this.files = []

        this.onAuth = this.onAuth.bind(this)
        this.render = this.render.bind(this)

        // set default options
        const defaultOptions = {}

        // merge default options with the ones set by user
        this.opts = Object.assign({}, defaultOptions, opts)
    }

    install () {
        this.view = new ProviderView(this, {
            viewType: 'grid'
        })
        // Set default state for Facebook
        this.setPluginState({
            authenticated: false,
            files: [],
            folders: [],
            directories: [],
            activeRow: -1,
            filterInput: '',
            isSearchVisible: false
        })

        const target = this.opts.target
        if (target) {
            this.mount(target, this)
        }
    }

    uninstall () {
        this.view.tearDown()
        this.unmount()
    }

    onAuth (authenticated) {
        this.setPluginState({ authenticated })
        if (authenticated) {
            this.view.getFolder('albums')
        }
    }

    isFolder (item) {
        return ['app', 'cover', 'profile', 'mobile', 'wall', 'normal', 'album'].indexOf(item.type) !== -1
    }

    getItemData (item) {
        return item
    }

    getItemIcon (item) {
        let src = Facebook.prototype.isFolder(item) ? item.picture.data.url : item.picture
        return <img src={src} />
    }

    getItemSubList (item) {
        return item.data
    }

    getItemName (item) {
        return item.name ? '' + item.name : '' + item.id
    }

    getMimeType (item) {
        return 'image/jpeg'
    }

    getItemId (item) {
        return `${item.id}`
    }

    getItemRequestPath (item) {
        return `${item.id}`
    }

    getItemModifiedDate (item) {
        return item.updated_time
    }

    getItemThumbnailUrl (item) {
        return item.picture
    }

    render (state) {
        return this.view.render(state)
    }
}
