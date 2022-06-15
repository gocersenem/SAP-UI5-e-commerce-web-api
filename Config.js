class Config {
    constructor() {
        this.appName = 'UI5 Starter Template'
    }

    setTitle() {
        document.title = this.appName;
    }

    setVersion() {
        $.getJSON('version.json').then(json => {
            this.version = json.version;
        })
    }

    getAppName() {
        return this.appName;
    }

    getVersion() {
        return this.version;
    }
}