import { Component } from '@angular/core';
import { MotelsService } from 'src/app/services/motels.service';
import { SendDataService } from 'src/app/services/send-data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-update-motel',
  templateUrl: './update-motel.component.html',
  styleUrls: ['./update-motel.component.css'],
})
export class UpdateMotelComponent {
  marker!: L.Marker | null;
  map!: L.Map;
  routingControl: any;
  id: string = '';
  isAccept: number = 0;
  motel: any | null = {};
  listImage: string[] = [];
  lat: string = '';
  lon: string = '';
  isLocation = false;
  distanceKm!: number;
  username: string | null = '';
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
    electric: '',
    water: '',
    wifi: '',
    amount: '',
    hostName: '',
    addressHostName: '',
    numberPhone: '',
  };

  constructor(
    private http: HttpClient,
    private motelService: MotelsService,
    private sendData: SendDataService,
    private authService: AuthService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.sendData.currentIdMotel.subscribe(async (data: any) => {
      this.id = data;
      if (data) {
        await this.loadMotelData();
      }
      if (this.formData.address && this.formData.subDistrict) {
        await this.getLocation();
        this.initMap();
      }
    });
  }

  initMap(): void {
    if (this.isLocation) {
      const customIcon = L.icon({
        iconUrl: './assets/icons/marker.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38], 
        popupAnchor: [0, -38] 
      });
      if (!this.map) {
        this.map = L.map('map').setView([parseFloat(this.lat), parseFloat(this.lon)],14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      } else {
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
      }
      this.marker = L.marker([
        parseFloat(this.lat),
        parseFloat(this.lon),
      ] ,{icon: customIcon}).addTo(this.map);
      this.map.setView([parseFloat(this.lat), parseFloat(this.lon)], 14);
      this.removeIcon();
    } else {
      alert('Không tồn tại vị trí này');
    }
  }

  async getLocationOnChange(): Promise<void> {
    console.log('lấy lại location');
    await this.getLocation();
    this.initMap();
  }

  async getLocation(): Promise<void> {
    const address = `${this.formData.address}, ${this.formData.subDistrict}, Quy Nhơn, Bình Định`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const location = data[0];
        this.lat = location.lat;
        this.lon = location.lon;
        console.log(this.lat);
        console.log(this.lon);
        this.isLocation = true;
      } else {
        console.log('No results found');
        this.isLocation = false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async loadMotelData(): Promise<void> {
    try {
      const data = await this.motelService.getMotelById(this.id).toPromise();
      this.formData.nameMotel = data.NameMotel;
      this.formData.address = data.Address;
      this.formData.subDistrict = data.SubDistrict;
      this.formData.description = data.Description;
      this.formData.convenient = data.Convenient;
      this.formData.acreage = data.Acreage;
      this.formData.price = data.Price.toLocaleString('vi-VN');
      this.formData.electric = data.PriceElectric.toLocaleString('vi-VN');
      this.formData.water = data.PriceWater.toLocaleString('vi-VN');
      this.formData.wifi = data.PriceWifi.toLocaleString('vi-VN');
      this.formData.amount = data.Amount;
      this.formData.hostName = data.Landlord.HostName;
      this.formData.addressHostName = data.Landlord.Address;
      this.formData.numberPhone = data.Landlord.NumberPhone;
      this.formData.userUpdate = this.authService.getUsernameFromToken();
      this.listImage = data.Image
        ? data.Image.map((image: any) => image.Image)
        : [];
    } catch (error) {
      console.error('Error loading motel data:', error);
    }
  }

  onFileSelectedImages(event: any): void {
    this.selectedFileImages = event.target.files;
  }

  async calculateDistance() {
    // Kiểm tra xem toaDo có giá trị không rỗng
    if (this.lat && this.lon) {
      const startWaypoint = L.latLng(
        parseFloat(this.lat),
        parseFloat(this.lon)
      );
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
      // Sử dụng Promise để bao gói sự kiện không đồng bộ
      const calculateDistancePromise = new Promise<number>(
        (resolve, reject) => {
          routingControl.on('routesfound', (event) => {
            const routes = event.routes;
            // Kiểm tra xem có ít nhất một đường đi hay không
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
        }
      );
      // Trigger tính toán đường đi
      routingControl.route();
      // Chờ đợi kết quả từ sự kiện không đồng bộ
      try {
        this.distanceKm = await calculateDistancePromise;
        this.formData.distance = this.distanceKm;
      } catch (error) {
        console.error('Error calculating distance:', error);
      }
    }
  }

  removeInfoDetail(event: Event) {
    event.preventDefault();
    const overlay = document.querySelector('.overlay-U') as HTMLElement;
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

  async updateMotel(motelId: string): Promise<void> {
    await this.calculateDistance();
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
    console.log(this.formData);

    const dataMotel = new FormData();
    for (let file of this.selectedFileImages) {
      dataMotel.append('images', file);
    }
    for (let key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        dataMotel.append(key, this.formData[key]);
      }
    }
    setTimeout(() => {
      const apiUrl = `http://localhost:3000/api/motel/${motelId}`;
      this.http.put<any>(apiUrl, dataMotel).subscribe(
        (data) => {
          console.log('Update successful:', data);
          alert('Cập nhật thành công 1 nhà trọ.');
          window.location.reload();
          const overlay = document.querySelector('.overlay-U') as HTMLElement;
          if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
          }
        },
        (error) => {
          console.error('Error updating files and data:', error);
        }
      );
    }, 10);
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
}
