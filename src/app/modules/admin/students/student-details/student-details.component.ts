import { Component, ViewEncapsulation, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/services/api.service';

@Component({
    selector: 'student-details',
    templateUrl: './student-details.component.html',
    styleUrls: ['./student-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StudentDetailsComponent implements OnInit, OnDestroy {

    pageNo: number = 0;
    isLoading: boolean = false;
    hasMore: boolean = true;

    studentList: any[] = [];
    studentId = null;
    studentObject:any = null;

    constructor(private _activatedRoute: ActivatedRoute, private _changeDetectorRef: ChangeDetectorRef, private apiService: ApiService, private _snackBar: MatSnackBar) {
        this._activatedRoute.params.subscribe(params => {
            this.studentId = params["studentId"];
            if (this.studentId) {
                this.getStudentByIdFromServer();
            }
        });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
    }

    async getStudentByIdFromServer() {

        try {
            this.isLoading = true;
            // this._changeDetectorRef.detectChanges();
            const getStudentByIdResponse: any = await this.apiService.getStudentById(this.studentId).toPromise();
            console.log("getStudentByIdResponse => ", getStudentByIdResponse);
            if (getStudentByIdResponse.data) {
                this.studentObject = getStudentByIdResponse.data;
            } else {
                throw getStudentByIdResponse;
            }
            this.isLoading = false;
            // this._changeDetectorRef.detectChanges();
        } catch (error) {
            console.error(error);
            if (error?.error?.message) {
                this._snackBar.open(error?.error?.message, "", {
                    horizontalPosition: "center",
                    verticalPosition: "top",
                    duration: 3000,
                    // panelClass: ['success-toast']
                    panelClass: ['error-toast']
                })
            } else {
                this._snackBar.open("Something went wrong! Try again", "", {
                    horizontalPosition: "center",
                    verticalPosition: "top",
                    duration: 3000,
                    // panelClass: ['success-toast']
                    panelClass: ['error-toast']
                })
            }
            this.isLoading = false;
            // this._changeDetectorRef.detectChanges();
        }
    }

    onScroll() {

    }



    onTeacherImgError(event) {
        event.target.src = '../../../../../../assets/images/avatars/dummy user.png';
    }
}
