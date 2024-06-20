import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-add-motel',
  templateUrl: './add-motel.component.html',
  styleUrls: ['./add-motel.component.css']
})
export class AddMotelComponent {
  marker!: L.Marker | null;
  map!: L.Map;
  routingControl: any;
  isAccept: number = 0;
  listImage: string[] = [];
  lat: string = '';
  lon: string = '';
  isLocation = false;
  distanceKm!:number ;
  selectedFileImages: File[] = [];
  listSubDistrict = [
    'Bùi Thị Xuân',
    'Đống Đa',
    'Ghềnh Ráng',
    'Hải Cảng',
    'Lê Hồng Phong',
    'Lê Lợi',
    'Lý Thường Kiệt',
    'Ngô Mây',
    'Nguyễn Văn Cừ',
    'Nhơn Bình',
    'Nhơn Phú',
    'Quang Trung',
    'Thị Nại',
    'Trần Hưng Đạo',
    'Trần Phú',
    'Trần Quang Diệu',
    'Nhơn Châu',
    'Nhơn Hải',
    'Nhơn Hội',
    'Nhơn Lý',
    'Phước Mỹ',
  ];

  formData: any = {
    nameMotel: '',
    address: '',
    subDistrict: '',
    description: '',
    convenient: '',
    acreage: '',
    price: '',
    electric: '3.500',
    water: '15.000',
    wifi: '0',
    amount: '',
    hostName: '',
    addressHostName: '',
    numberPhone: '',
  };

  constructor(
    private http: HttpClient,
    private authService : AuthService,
  ) {}


  // async ngAfterViewInit(): Promise<void> {
  //   await this.getLocation();
  //   this.initMap();
  // }

  initMap(): void{
    if(this.isLocation){
      const customIcon = L.icon({
        iconUrl: './assets/icons/marker.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38], 
        popupAnchor: [0, -38] 
      });
      if (!this.map) {
        this.map = L.map('map2').setView([parseFloat(this.lat), parseFloat(this.lon)], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    else{
      alert('Không tồn tại vị trí này');
    }
  }

  async getLocationOnChange(): Promise<void> {
    console.log('chạy');
      await this.getLocation();
      this.initMap();
  }

  async getLocation(): Promise<void> {
    const address = `${this.formData.address}, ${this.formData.subDistrict}, Quy Nhơn, Bình Định`;
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
        console.log("No results found");
        this.isLocation = false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  
  onFileSelectedImages(event: any): void {
    this.selectedFileImages = event.target.files;
  }

  calculateDistance() { 
    // Kiểm tra xem toaDo có giá trị không rỗng
    if (this.lat && this.lon) {
      const startWaypoint = L.latLng(parseFloat(this.lat), parseFloat(this.lon));
      const endWaypoint = L.latLng(13.75892, 109.21872);
      // Tạo đối tượng điều khiển định tuyến
      const routingControlOptions: L.Routing.RoutingControlOptions & {
        createMarker?: () => null;
      } = {
        waypoints: [startWaypoint, endWaypoint],
        routeWhileDragging: true,
        addWaypoints: false,
        createMarker: () => null,
      };
      const routingControl = L.Routing.control(routingControlOptions);
      // Lắng nghe sự kiện sau khi đường đi đã được tính toán
      routingControl.on('routesfound', (event) => {
        const routes = event.routes;
        // Kiểm tra xem có ít nhất một đường đi hay không
        if (routes.length > 0) {
          const route = routes[0];
          const distanceInMeters = route.summary.totalDistance;
          const distanceInKm = (distanceInMeters / 1000).toFixed(1);
          this.distanceKm = Number(distanceInKm);
          this.formData.distance = this.distanceKm;     
          
        }
      });
      // Trigger tính toán đường đi
      if (routingControl) {
        routingControl.route();
      } 
    }
  }



  removeInfoDetail(event: Event) {
    event.preventDefault();
    const overlay = document.querySelector('.overlay-A') as HTMLElement;
    if (overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  }
  
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  
  formatPrice(field: string) {
    if (this.formData[field]) {
      const numberValue = parseInt(this.formData[field].replace(/\D/g, ''), 10);
      if (!isNaN(numberValue)) {
        this.formData[field] = numberValue.toLocaleString('vi-VN');
      } else {
        this.formData[field] = '';
      }
    } 
  }
  
  addMotel(){
    this.calculateDistance(); 
    this.formData.price = !isNaN(parseFloat(this.formData.price.replace(/\./g, '').replace(',', '.')))
      ? parseFloat(this.formData.price.replace(/\./g, '').replace(',', '.'))
      : this.formData.price;

    this.formData.electric = !isNaN(parseFloat(this.formData.electric.replace(/\./g, '').replace(',', '.')))
      ? parseFloat(this.formData.electric.replace(/\./g, '').replace(',', '.'))
      : this.formData.electric;

    this.formData.water = !isNaN(parseFloat(this.formData.water.replace(/\./g, '').replace(',', '.')))
      ? parseFloat(this.formData.water.replace(/\./g, '').replace(',', '.'))
      : this.formData.water;

    this.formData.wifi = !isNaN(parseFloat(this.formData.wifi.replace(/\./g, '').replace(',', '.')))
      ? parseFloat(this.formData.wifi.replace(/\./g, '').replace(',', '.'))
      : this.formData.wifi;

    this.formData.latLng = `${this.lat},${this.lon}`;
    this.formData.userCreate = this.authService.getUsernameFromToken();
    this.formData.isAccept = 0;
    console.table(this.formData);
    
    const dataMotel = new FormData();
    for (let file of this.selectedFileImages) {
      dataMotel.append('images', file);
    }
    for (let key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        dataMotel.append(key, this.formData[key]);
      }
    }

    const apiUrl = `http://localhost:3000/api/motel`;
    this.http
      .post<any>(apiUrl, dataMotel)
      .subscribe(
        (data) => {
          console.log('add successful:', data);
          alert('Thêm thành công 1 nhà trọ.');
          window.location.reload();
          const overlay = document.querySelector('.overlay-A') as HTMLElement;
          if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
          }
        },
        (error) => {
          console.error('Error add files and data:', error);
        }
      );

  }

  removeIcon(){
    const icon = document.querySelector('.leaflet-control-attribution.leaflet-control ') as HTMLElement;
    const icon2 = document.querySelector('.leaflet-control-zoom.leaflet-bar.leaflet-control') as HTMLElement;
    icon.style.display = 'none'
    icon2.style.display = 'none'
  }
}
