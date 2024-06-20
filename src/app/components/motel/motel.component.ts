import { Component } from '@angular/core';
import { MotelsService } from 'src/app/services/motels.service';
import { SendDataService } from 'src/app/services/send-data.service';
@Component({
  selector: 'app-motel',
  templateUrl: './motel.component.html',
  styleUrls: ['./motel.component.css']
})
export class MotelComponent {
  selectedMotelId: string | null = null;
  listMotel: any[] = [];
  searchText= '';
  inputSearch: string = '';
  constructor(private motelService: MotelsService,private sendData: SendDataService,){}
  ngOnInit(): void {
    this.motelService.getAllMotels().subscribe((data) => {
      this.listMotel= data; 
    });
  }

  openInfoDetail(motelId: string, isAccept: number){
    this.selectedMotelId = motelId;
    this.sendData.changeData(motelId, isAccept);
    const overlay = document.querySelector('.overlay') as HTMLElement;
    overlay.classList.add('active');
  }

  openUpdateForm(motelId: string){
    this.selectedMotelId = motelId;
    this.sendData.sendID(motelId);
    const overlayU = document.querySelector('.overlay-U') as HTMLElement;
    overlayU.classList.add('active');
  }

  openAddForm(){
    const overlayU = document.querySelector('.overlay-A') as HTMLElement;
    overlayU.classList.add('active');
  }

  deleteMotel(motelId: string, index: number): void {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa nhà trọ này?');
    if (confirmDelete) {
      this.motelService.deleteMotel(motelId).subscribe(
        (response) => {
          console.log('Motel deleted successfully:', response);
          this.listMotel.splice(index, 1);
        },
        (error) => {
          console.error('Error deleting motel:', error);
        }
      );
    }
  }
}
