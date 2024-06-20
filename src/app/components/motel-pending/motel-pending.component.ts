import { Component } from '@angular/core';
import { MotelPendingService } from 'src/app/services/motel-pending.service';
import { SendDataService } from 'src/app/services/send-data.service';
import { MotelsService } from 'src/app/services/motels.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
@Component({
  selector: 'app-motel-pending',
  templateUrl: './motel-pending.component.html',
  styleUrls: ['./motel-pending.component.css'],
})
export class MotelPendingComponent {
  selectedMotelId: string | null = null;
  listMotelPending: any[] = [];
  searchText= '';
  lat = '';
  lon = '';
  latLng = '';
  address = '';
  inputSearch: string = '';
  isLocation = false;
  distanceKm = 0;
  constructor(private motelPendingService: MotelPendingService,private sendData: SendDataService,
      private motelService : MotelsService,
  ){}

  ngOnInit(): void {
    this.motelPendingService.getAllMotelPending().subscribe((data) => {
      this.listMotelPending = data;      
    });
  }

  openInfoDetail(motelId: string, isAccept: number){
    this.selectedMotelId = motelId;
    this.sendData.changeData(motelId, isAccept);
    const overlay = document.querySelector('.overlay') as HTMLElement;
    overlay.classList.add('active');

  }


  deleteMotel(motelId: string, index: number): void {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa nhà trọ này?');
    if (confirmDelete) {
      this.motelPendingService.deleteMotelPending(motelId).subscribe(
        (response) => {
          console.log('Motel pending deleted successfully:', response);
          this.listMotelPending.splice(index, 1);
        },
        (error) => {
          console.error('Error deleting motel:', error);
        }
      );
    }
  }

  async getLocation(address: string): Promise<void> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const location = data[0];
        this.lat = location.lat;
        this.lon = location.lon;
        this.isLocation = true;
      } else {
        this.isLocation = false;
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }
  
  async calculateDistance(): Promise<void> {
    if (this.lat && this.lon) {
      const startWaypoint = L.latLng(parseFloat(this.lat), parseFloat(this.lon));
      const endWaypoint = L.latLng(13.75892, 109.21872);
      const routingControlOptions: L.Routing.RoutingControlOptions & {
        createMarker?: () => null;
      } = {
        waypoints: [startWaypoint, endWaypoint],
        routeWhileDragging: true,
        addWaypoints: false,
        createMarker: () => null,
      };
      const routingControl = L.Routing.control(routingControlOptions);
  
      const calculateDistancePromise = new Promise<number>((resolve, reject) => {
        routingControl.on('routesfound', (event) => {
          const routes = event.routes;
          if (routes.length > 0) {
            const route = routes[0];
            const distanceInMeters = route.summary.totalDistance;
            const distanceInKm = (distanceInMeters / 1000).toFixed(1);
            resolve(Number(distanceInKm));
          } else {
            reject('No routes found');
          }
        });
        routingControl.on('routingerror', (error) => {
          reject(error);
        });
      });
  
      routingControl.route();
      this.distanceKm = await calculateDistancePromise;
    }
  }

  async updateMotel(motelId: string, index: number): Promise<void> {

    try {
        const confirmAdd = confirm('Bạn có muốn thêm nhà trọ này?');
        if (confirmAdd) {
        const data = await this.motelService.getMotelById(motelId).toPromise();
        this.address = `${data.Address}, ${data.SubDistrict}, Quy Nhơn, Bình Định`;
        await this.getLocation(this.address);
        await this.calculateDistance();
        this.latLng = `${this.lat},${this.lon}`;
        const location = {
          latLng: this.latLng,
          distance: this.distanceKm
        };
        console.log(this.latLng);
        console.log('Updated distance:', this.distanceKm);
        console.log(location);
        
        await this.motelPendingService.updateMotelPending(motelId, location).subscribe(
          (response) => {
            console.log('Motel pending update successfully:', response);
            this.listMotelPending.splice(index, 1);
          },
          (error) => {
            console.error('Error updating motel:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error in updateMotel:', error);
    }
  }
}
