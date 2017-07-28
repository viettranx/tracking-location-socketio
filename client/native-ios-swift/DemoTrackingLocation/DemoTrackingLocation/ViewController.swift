//
//  ViewController.swift
//  DemoTrackingLocation
//
//  Created by Tran Viet on 7/28/17.
//  Copyright © 2017 Tran Viet. All rights reserved.
//

import UIKit
import GoogleMaps
import SocketIO

class ViewController: UIViewController {

    @IBOutlet weak var mapView: GMSMapView!
    
    let socket = SocketIOClient(
        //socketURL: URL(string: "http://trackinglocation.skylab.vn")!,
        socketURL: URL(string: "http://localhost:4333")!,
        config: [ .forceWebsockets(true) , .compress]
    )
    
    var markerDict:[String:GMSMarker] = [:]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let camera: GMSCameraPosition = GMSCameraPosition.camera(withLatitude: 10.7910203, longitude: 106.6926057, zoom: 13.5)
        mapView.camera = camera
        
        startSocketIO()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func startSocketIO() {
        socket.on(clientEvent: .connect) { (data, ack) in
            print("Client connected")
        }
        
        socket.on("locationUpdated") { [weak self] (data, ack) in
            guard let `self` = self else { return }
            guard let coords = data.first as? [String:Any] else { return }
            
            for (k, v) in coords {
                
                guard let coord = v as? [String:Double] else { continue }
                
                let lat = coord["lat"] ?? 0
                let lng = coord["lng"] ?? 0
                
                let coordForMarker = CLLocationCoordinate2D(latitude: lat, longitude: lng)
                
                if let marker = self.markerDict[k] {
                    marker.position = coordForMarker
                } else {
                    
                    let marker = self.createMarker(title: k, coord: coordForMarker)
                    marker.map = self.mapView
                    
                    self.markerDict[k] = marker
                }
                
            }
        }
        
        socket.connect()
    }
    
    func createMarker(title: String, coord: CLLocationCoordinate2D) -> GMSMarker {
        let gmsMarker = GMSMarker(position: coord)
        gmsMarker.icon = #imageLiteral(resourceName: "truck")
        gmsMarker.title = title
        gmsMarker.groundAnchor = CGPoint(x: 0.5, y: 0.5)
        
        return gmsMarker
    }


}

