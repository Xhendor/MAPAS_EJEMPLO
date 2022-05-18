import { Component, OnInit, ViewChild } from '@angular/core';
import { MapMarker } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { StarRatingColor } from './star-rating/star-rating.component';
import { Taquerias } from './taquerias';
import { TaqueriasService } from './taquerias.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  rating:number = 3;
  starCount:number = 5;
  starColor:StarRatingColor = StarRatingColor.accent;
  starColorP:StarRatingColor = StarRatingColor.primary;
  starColorW:StarRatingColor = StarRatingColor.warn;
  title = 'MAPAS_EJEMPLO';
  zoom = 12
  center!: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }
  markers:any[] = [];

  dataSource!: MatTableDataSource<Taquerias>;

  taquerias!:Taquerias[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  constructor(private taqueriasService:TaqueriasService){

    this.taqueriasService.getTaquerias().subscribe(taquerias => {
      this.dataSource= new MatTableDataSource(taquerias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = ['nombre', 'calidad', 'precio', 'comentario','pagina_fb','Action'];
  //dataSource = new TaqueriasDataSource(this.taqueriasService);

  getTaquerias(): void {
    this.taqueriasService.getTaquerias().subscribe(taquerias => this.taquerias=taquerias);
    console.log(this.taquerias);

  }
  getTaqueria():void{

  }
  updateTaqueria():void{}
  deleteTaqueria():void{}
  addTaqueria():void{}

  ngOnInit(): void {
    this.center = {
      lat: 32.638111,
      lng: -115.475548,
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })
    this.getTaquerias();


  }

  click(event: google.maps.MapMouseEvent) {
    console.log(event)
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom!) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom!) this.zoom--
  }


  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      options: { animation: google.maps.Animation.BOUNCE },
    })
  }

  onRatingChanged(rating:number){
    console.log(rating);
    this.rating = rating;
  }



   ngAfterViewInit() {

   }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}


// export class TaqueriasDataSource extends DataSource<Taquerias> {
//   constructor(private taqueriasService: TaqueriasService) {
//     super();
//   }
//   connect(): Observable<Taquerias[]> {
//     return this.taqueriasService.getTaquerias();
//   }
//   disconnect() {}
// }

