import { Component, OnInit } from '@angular/core';
import { MotelsService } from 'src/app/services/motels.service';
import { SendDataService } from 'src/app/services/send-data.service';
import { firstValueFrom } from 'rxjs';
import * as L from 'leaflet';
@Component({
  selector: 'app-infor-detail',
  templateUrl: './infor-detail.component.html',
  styleUrls: ['./infor-detail.component.css'],
})
export class InforDetailComponent {
  id: string = '';
  isAccept: number = 0;
  latLng: string = '';
  motel: any | null = {};
  listImage: string[] = [];
  map!: L.Map;
  marker!: L.Marker | null;
  lat: string = '';
  lon: string = '';

  constructor(
    private motelService: MotelsService,
    private sendData: SendDataService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    const data = await firstValueFrom(this.sendData.currentData);
    this.id = data.id;
    this.isAccept = data.isAccept;
    if (this.id) {
      await this.loadMotelData(); 
    }
    await this.getLocation()
  }

  async loadMotelData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.motelService.getMotelById(this.id).subscribe((data) => {
        if (data) {
          this.motel = data;
          this.listImage = data.Image
            ? data.Image.map((image: any) => image.Image)
            : [];
          this.latLng = data.LatLng;
          resolve();
        } else {
          reject('No data found');
        }
      }, error => reject(error));
    });
  }

  initMap(): void {
    const customIcon = L.icon({
      iconUrl: './assets/icons/marker.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38], 
      popupAnchor: [0, -38] 
    });
    if (!this.map) {
      this.map = L.map('mapView').setView([parseFloat(this.lat), parseFloat(this.lon)],14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    } else {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
    }
    this.marker = L.marker([parseFloat(this.lat), parseFloat(this.lon)], {icon: customIcon}).addTo(this.map);
    this.map.setView([parseFloat(this.lat), parseFloat(this.lon)], 14);
    this.removeIcon();
  }

  async getLocation(): Promise<void> {
    const address = `${this.motel.Address}, ${this.motel.SubDistrict}, Quy Nhơn, Bình Định`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length > 0) {
        const location = data[0];
        this.lat = location.lat;
        this.lon = location.lon;
      } else {
        console.log('No results found for the given address.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  }

  removeInfoDetail(event: Event) {
    event.preventDefault();
    const overlay = document.querySelector('.overlay') as HTMLElement;
    if (overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  nextImage() {
    const otherImage = document.querySelector(
      '.other-image-area'
    ) as HTMLElement;
    const imgs = otherImage.querySelectorAll('.image');
    otherImage.appendChild(imgs[0]);
  }

  prevImage() {
    const otherImage = document.querySelector(
      '.other-image-area'
    ) as HTMLElement;
    const imgs = otherImage.querySelectorAll('.image');
    otherImage.prepend(imgs[imgs.length - 1]);
  }

  removeIcon() {
    const icon = document.querySelector(
      '.leaflet-control-attribution.leaflet-control '
    ) as HTMLElement;
    const icon2 = document.querySelector(
      '.leaflet-control-zoom.leaflet-bar.leaflet-control'
    ) as HTMLElement;
    icon.style.display = 'none';
    icon2.style.display = 'none';
  }

  openViewMap(){
    const viewMap = document.querySelector('.viewMap') as HTMLElement;
    const location = document.querySelector('.view-on-map') as HTMLElement;
    const map = document.querySelector('.map') as HTMLElement;
    viewMap.style.visibility = 'visible';
    viewMap.style.minHeight = '265px';
    viewMap.style.marginBottom = '10px';
    map.style.display = 'flex';
    location.style.display = 'none';
    this.initMap();
  }

  removeViewMap(){
    const viewMap = document.querySelector('.viewMap') as HTMLElement;
    const location = document.querySelector('.view-on-map') as HTMLElement;
    const map = document.querySelector('.map') as HTMLElement;
    viewMap.style.visibility = 'hidden';
    map.style.display = 'none';
    viewMap.style.minHeight = '0px';
    location.style.display = 'flex';
    viewMap.style.marginBottom = '3px';

  }
}
