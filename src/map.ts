

export interface Coords {
    lat: number,
    lng: number
}

export interface MarkerMeta extends Coords {
    center: boolean
    src: string
}

let ZOOM: number = 14.5

export class HereMap {

    container: HTMLDivElement
    apiKey: string
    appId: string
    
    platform: H.service.Platform
    map: H.Map
    defaultCenter: Coords


    constructor(container: HTMLDivElement, apiKey: string, appId: string, center: Coords) {
        this.container = container

        this.apiKey = apiKey
        this.appId = appId
        this.defaultCenter = center

    }

    initMap() {
        this.platform = new H.service.Platform({
            'app_id': this.appId,
            'app_code': this.apiKey
        })
        let maptypes = this.platform.createDefaultLayers()
        this.map = new H.Map(this.container, maptypes.normal.map)
        this.map.setCenter({ lat: this.defaultCenter.lat, lng: this.defaultCenter.lng })
        this.map.setZoom(ZOOM)
        this.map.setBaseLayer(maptypes.terrain.base)
        let mapEvents = new H.mapevents.MapEvents(this.map)
    }


    addMarker(imageSrc: string, coords: Coords, focus: boolean = false) {
        let icon = new H.map.Icon(imageSrc)
        let marker = new H.map.Marker(coords, { icon: icon })
        
        this.map.addObject(marker)
        if (focus)
            this.map.setCenter(coords)
        
    }

    centerBetween(first: Coords, second: Coords) {
        let middle = this.findMiddlePoint(first, second)
        debugger
        this.map.setCenter(middle)
    }


    findMiddlePoint(first: Coords, second: Coords) : Coords {
        return {
            lat: (second.lat + first.lat) / 2,
            lng: (second.lng + first.lng) / 2
        }
    }

}


