import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import io from 'socket.io-client';

const socketURL = 'http://trackinglocation.skylab.vn'

console.ignoredYellowBox = ['Setting a timer'];

export default class tracking_location extends Component {

  constructor(props) {
    super(props);

    this.socket = io(socketURL);

    this.state = {
      markerCoordinates : [],
      region: {
        latitude: 10.782546,
        longitude: 106.650416,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    }
  }

  componentDidMount() {

    const socket = this.socket;
    if (!socket) return;

    socket.on('disconnect', () => alert('You have been disconnected.'));

    socket.on("locationUpdated", (locationState) => {
      const newMarkerCoordinates = Object.values(locationState).map( item => ({ 
        latitude: item.lat,
        longitude: item.lng
      }));

      this.setState({ markerCoordinates: newMarkerCoordinates });
    });
  }

  renderMarkers = (markerCoordinates) => {
    return markerCoordinates.map((coord, index) => (
      <MapView.Marker
        key={ index }
        image={require('./imgs/truck.png')} 
        centerOffset={{ x: 25, y: 25}}
        anchor={{ x: 0.5, y: 0.5}}
        coordinate={coord}
        title={ `Truck ${index}` }
      />
    ));
  }


  render() {

    const { region, markerCoordinates } = this.state;

    return (
      <View style={styles.container}>
        <MapView
           provider={ PROVIDER_GOOGLE }
           initialRegion={ region }
           style={ styles.mapView }
        >
          { this.renderMarkers(markerCoordinates) }
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView : {
    flex: 1,
  }
});
