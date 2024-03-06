import { Injectable } from '@nestjs/common';
import { DirectionPointHelper } from '../helpers/direction_point.helper';
import { PolylineService } from 'src/modules/polyline/polyline.service';
import { Client, DirectionsRequest, TravelMode } from "@googlemaps/google-maps-services-js";
import { ILocation } from '../interfaces/location.interface';

@Injectable()
export class GoogleMapsApiService {
  constructor(
    private readonly polylineService: PolylineService
  ) { }

  async getDirections(arrSelectives: Array<{origin: ILocation, destination: ILocation}>) {
    const arrResponse = [];
    for (let element of arrSelectives) {
      try {
        const response = await this.directionsRequest(element.origin, element.destination);
        const data = response.data;
        if (data.status === 'OK') {
          const legsPathInOrderSelective = DirectionPointHelper.legsPathInOrderSelective(data);
          arrResponse.push(legsPathInOrderSelective);
        } else {
          arrResponse.push(data.status);
        }
      } catch (error) {
        const response = error.response;
        if (response) {
          const status = response.data.status;
          arrResponse.push(status);
        } else {
          arrResponse.push(error.message);
        }
      }
    }

    const data = {
      polylines: arrResponse
    }

    const polylines = await this.polylineService.create(data);
    return polylines;
  }

  private directionsRequest = (start: ILocation, end: ILocation) => {
    const origin = {
      lat: start.lat || NaN,
      lng: start.lng || NaN
    }
    const destination = {
      lat: end.lat || NaN,
      lng: end.lng || NaN
    }
    const request: DirectionsRequest = {
      params: {
        key: process.env.GOOGLE_MAP_API_KEY,
        origin, //Điểm Start
        destination, // Điểm Đích
        mode: TravelMode.driving, // Phương tiện giao thông,
      }
    }
    const googleMapsClient = new Client();
    return googleMapsClient.directions(request)
  }
}
