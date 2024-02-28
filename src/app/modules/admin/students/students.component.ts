import { Component, ViewEncapsulation, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'app/services/api.service';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class studentsComponent implements OnInit, OnDestroy {

    pageNo: number = 0;
    isLoading: boolean = false;
    hasMore: boolean = true;

    studentList: any[] = [];
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(private _changeDetectorRef: ChangeDetectorRef, private apiService: ApiService, private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.getUsersWithPaginationFromServer(false);

        this.searchInputControl.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(query => {
            this.getUsersWithPaginationFromServer(false);
        })
    }

    ngOnDestroy(): void {
    }

    async getUsersWithPaginationFromServer(isMerge: boolean) {
        if (!isMerge) {
            this.pageNo = 0;
        }

        try {
            this.isLoading = true;
            this._changeDetectorRef.detectChanges();
            const getUsersWithPaginationResponse: any = await this.apiService.getUsersWithPagination(this.pageNo, this.searchInputControl.value).toPromise();
            console.log("getUsersWithPaginationResponse => ", getUsersWithPaginationResponse);
            if (getUsersWithPaginationResponse.data) {
                if (isMerge) {
                    this.studentList = [...this.studentList, ...getUsersWithPaginationResponse.data];
                    // this.studentList = [...this.studentList, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data,];
                } else {
                    this.studentList = getUsersWithPaginationResponse.data;
                    // this.studentList = [...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data, ...getUsersWithPaginationResponse.data,];
                }
            } else {
                throw getUsersWithPaginationResponse;
            }
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
        } catch (error) {
            console.error(error);
            if (error?.error?.message === "Requested range not satisfiable") {
                this.hasMore = false;
            } else if (error?.error?.message) {
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
            // this.studentList = [];
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    onScroll() {
        if (!this.isLoading && this.hasMore) {
            console.log("onScroll IF");
            this.pageNo++;
            this.getUsersWithPaginationFromServer(true);
        } else {
            console.log("onScroll ELSE");
        }
    }



    onTeacherImgError(event) {
        event.target.src = '../../../../../../assets/images/avatars/dummy user.png';
    }
}
