import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CoursesService } from 'app/modules/admin/courses-page/courses/courses.service';
import { ApiService } from 'app/services/api.service';
import { AuthService } from 'app/modules/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'transfer-teacher-request-list',
    templateUrl: './transfer-teacher-request-list.component.html',
    styleUrls: ['./transfer-teacher-request-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class TransferTeacherRequestListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    requestServerList: any[] = [];
    requestList: any[] = [];

    flashMessage: 'success' | 'error' | null = null;

    isLoading: boolean = false;
    pagination = {
        "length": this.requestList.length,
        "size": 10,
        "page": 0,
        "lastPage": Math.ceil(this.requestList.length / 10),
        "startIndex": 0,
        "endIndex": 9
    };
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedRequest: any | null = null;

    user: any = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _inventoryService: CoursesService,
        private apiService: ApiService,
        private authService: AuthService,
        private _snackBar: MatSnackBar
    ) {
        this.authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
        });
    }

    ngOnInit(): void {
        this.getAllTransferTeacherRequestFromServer();
        this.searchInputControl.valueChanges.subscribe(query => {
            // console.log({query});
            // console.log(this.teacherServerList.map(m => ({...m, name: m.first_name+" "+m.last_name})).filter(f => f.name.includes(query)));

            this.requestList = this.requestServerList.map(m => ({...m, name:  `${m?.order_id?.student_id?.first_name} ${m?.order_id?.student_id?.last_name}`.toLowerCase()})).filter(f => f.name.includes(query.toLowerCase()));
        })
    }

    async getAllTransferTeacherRequestFromServer() {
        try {
            this._changeDetectorRef.detectChanges();
            const getAllTransferTeacherRequestResponse: any = await this.apiService.getAllTransferTeacherRequest();
            /* console.log("getAllTransferTeacherRequestResponse => ", getAllTransferTeacherRequestResponse); */
            if (getAllTransferTeacherRequestResponse.data) {
                this.requestServerList = getAllTransferTeacherRequestResponse.data;
                this.requestList = getAllTransferTeacherRequestResponse.data;

                console.log("requestServerList => ", this.requestServerList)
            } else {
                throw getAllTransferTeacherRequestResponse;
            }
            this._changeDetectorRef.detectChanges();
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
            this._changeDetectorRef.detectChanges();
        }
    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'studentName',
                start: 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get courseList if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleDetails(changeTeacherRequestId: string): void {
        if (this.selectedRequest && this.selectedRequest.change_teacher_request_id === changeTeacherRequestId) {
            this.selectedRequest = null;
            this.closeDetails();
            return;
        }

        const _requestDetails = this.requestList.find(f => f.change_teacher_request_id === changeTeacherRequestId)
        console.log(_requestDetails)
        this.selectedRequest = { ..._requestDetails };
        this._changeDetectorRef.markForCheck();
    }


    closeDetails(): void {
        this.selectedRequest = null;
    }

    rejectSelectedRequest() {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Reject Request',
            message: 'Are you sure you want to reject this request? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Reject'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            console.log(result);

            if ( result === 'confirmed' ) {
                this.rejectSelectedRequestToServer();
            }
        });
    }

    async rejectSelectedRequestToServer() {
        try {
            this.isLoading = true;
            const rejectTransferTeacherRequestResponse: any = await this.apiService.rejectTransferTeacherRequest(this.selectedRequest?.change_teacher_request_id);
            console.log("rejectTransferTeacherRequestResponse => ", rejectTransferTeacherRequestResponse);

            if (rejectTransferTeacherRequestResponse?.data) {
              this._snackBar.open("Request rejected successfully.", "", {
                horizontalPosition: "center",
                verticalPosition: "top",
                duration: 3000,
                panelClass: ['success-toast']
                // panelClass: ['error-toast']
              });

              this.getAllTransferTeacherRequestFromServer();
            } else {
                throw rejectTransferTeacherRequestResponse;
            }
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
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
            this._changeDetectorRef.detectChanges();
        }
    }

    acceptSelectedRequest() {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Accept Request',
            message: 'Are you sure you want to accept this request? This action cannot be undone!',
            icon       : {
                show : true,
                name : 'mat_outline:check_circle',
                color: 'success'
            },
            actions: {
                confirm: {
                    label: 'Accept',
                    color: 'primary'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            console.log(result);

            if ( result === 'confirmed' ) {
                this.acceptSelectedRequestToServer();
            }
        });
    }

    async acceptSelectedRequestToServer() {
        try {
            this.isLoading = true;
            const postBody = {
                change_teacher_request_id: this.selectedRequest?.change_teacher_request_id,
                teacher_id: this.selectedRequest?.new_teacher_id?.teacher_id,
                start_date: this.selectedRequest?.new_start_date,
                end_date: this.selectedRequest?.new_end_date,
                start_time: this.selectedRequest?.new_start_time,
                end_time: this.selectedRequest?.new_end_time,
                schedule_id: this.selectedRequest?.new_schedule_id,
                order_id: this.selectedRequest?.order_id?.order_id,
            }

            const rejectTransferTeacherRequestResponse: any = await this.apiService.acceptTransferTeacherRequest(postBody);
            console.log("rejectTransferTeacherRequestResponse => ", rejectTransferTeacherRequestResponse);

            if (rejectTransferTeacherRequestResponse?.data) {
              this._snackBar.open("Request accepted successfully.", "", {
                horizontalPosition: "center",
                verticalPosition: "top",
                duration: 3000,
                panelClass: ['success-toast']
                // panelClass: ['error-toast']
              });

              this.getAllTransferTeacherRequestFromServer();
            } else {
                throw rejectTransferTeacherRequestResponse;
            }
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
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
            this._changeDetectorRef.detectChanges();
        }
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    getDateString(classItem) {
        return `${new Date(classItem?.start_date).toDateString()} - ${new Date(classItem?.end_date).toDateString()}`
    }

    getTimeString(classItem) {
        return `${this.time24to12Convert(classItem?.start_time)} - ${this.time24to12Convert(classItem?.end_time)}`
    }

    time24to12Convert(time) {
        const [hourString, minute] = time.split(":");
        const hour = +hourString % 24;
        return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
    }

    onTeacherImgError(event) {
        event.target.src = '../../../../../../assets/images/avatars/dummy user.png';
    }
}
