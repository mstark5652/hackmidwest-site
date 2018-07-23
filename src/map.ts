

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
			'app_code': this.apiKey,
			'useHTTPS': true
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
		this.map.setCenter(middle)
	}


	findMiddlePoint(first: Coords, second: Coords): Coords {
		return {
			lat: (second.lat + first.lat) / 2,
			lng: (second.lng + first.lng) / 2
		}
	}

	route(start: Coords, destination: Coords) {
		// Create the parameters for the routing request:
		let routingParameters = {
			// The routing mode:
			'mode': 'fastest;car',
			// The start point of the route:
			'waypoint0': `geo!${start.lat},${start.lng}`,
			// The end point of the route:
			'waypoint1': `geo!${destination.lat},${destination.lng}`,
			// To retrieve the shape of the route we choose the route
			// representation mode 'display'
			'representation': 'display'
		};

		let _this = this
		let callback = function (result: H.service.ServiceResult) {
			// let route: object
			// let routeShape: object
			let linestring: H.geo.LineString
			
			if (result.response.route) {
				// Pick the first route from the response:
				let route = result.response.route[0]
				// Pick the route's shape:
				let routeShape = route.shape

				// Create a linestring to use as a point source for the route line
				linestring = new H.geo.LineString()

				// Push all the points in the shape into the linestring:
				routeShape.forEach(function (point) {
					let parts = point.split(',');
					linestring.pushLatLngAlt(Number(parts[0]), Number(parts[1]), 0);
				});

				// // Retrieve the mapped positions of the requested waypoints:
				// startPoint = route.waypoint[0].mappedPosition;
				// endPoint = route.waypoint[1].mappedPosition;

				// Create a polyline to display the route:
				var routeLine = new H.map.Polyline(linestring, {
					style: { strokeColor: 'blue', lineWidth: 10 }
				});

				// // Create a marker for the start point:
				// var startMarker = new H.map.Marker({
				// 	lat: startPoint.latitude,
				// 	lng: startPoint.longitude
				// });

				// // Create a marker for the end point:
				// var endMarker = new H.map.Marker({
				// 	lat: endPoint.latitude,
				// 	lng: endPoint.longitude
				// });

				// Add the route polyline and the two markers to the map:
				_this.map.addObjects([routeLine])

				// Set the map's viewport to make the whole route visible:
				_this.map.setViewBounds(routeLine.getBounds())
				_this.map.setZoom(ZOOM)
			}
		}
		// Get an instance of the routing service:
		var router = this.platform.getRoutingService();

		// Call calculateRoute() with the routing parameters,
		// the callback and an error callback function (called if a
		// communication error occurs):
		router.calculateRoute(routingParameters, callback,
			function (error: Error) {
				console.log("Error ", error.message);
			});

	}

	resetObjects() {
		let items = this.map.getObjects()
		this.map.removeObjects(items)
		this.map.setZoom(ZOOM)
	}
	
	defaultZoom() {
		this.map.setZoom(ZOOM)
	}

	resize() {
		let top = this.container.clientTop
		let left = this.container.clientLeft
		let width = this.container.clientWidth
		let height = this.container.clientHeight
		this.map.setViewBounds(new H.geo.Rect(top, left, top + height, left + width))
		this.map.setZoom(ZOOM)
	}

}


