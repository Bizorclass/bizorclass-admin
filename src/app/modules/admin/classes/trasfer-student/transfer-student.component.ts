import { ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'app/services/api.service';

@Component({
    selector: 'transfer-student',
    templateUrl: './transfer-student.component.html',
    styles: [
        `
            .fuse-confirmation-dialog-panel {

                @screen md {
                    @apply w-128;
                }

                .mat-mdc-dialog-container {

                    .mat-mdc-dialog-surface {
                        padding: 0 !important;
                    }
                }
            }

            .inventory-grid {
                grid-template-columns: 112px 112px 112px auto 72px;
                /* grid-template-columns: auto 72px; */

                @screen sm {
                    grid-template-columns: 112px 112px 112px auto 72px;
                    /* grid-template-columns: auto 72px; */
                }

                @screen md {
                    grid-template-columns: 112px 112px 112px auto 72px;
                    /* grid-template-columns: auto 72px; */
                }

                @screen lg {
                    grid-template-columns: 112px 112px 112px auto 72px;
                    /* grid-template-columns: auto 72px; */
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class TransferStudentComponent {

    teacherList = null;
    selectedTeacher = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TransferStudentComponent>, private apiService: ApiService, private _changeDetectorRef: ChangeDetectorRef) {
        console.log({ data });
        if (data?.teacher_id) {
            this.getTeacherListExceptTeacherIdFromServer();
        }
    }

    getTeacherListExceptTeacherIdFromServer() {
        this.apiService.getTeacherListExceptTeacherId(this.data.teacher_id.teacher_id).subscribe(async (getTeacherListExceptTeacherIdResponse: any) => {
            console.log(getTeacherListExceptTeacherIdResponse);
            if (getTeacherListExceptTeacherIdResponse.data) {
                this.teacherList = getTeacherListExceptTeacherIdResponse.data;
                this._changeDetectorRef.detectChanges();
            } else {
                // !! error handle
            }
            // this.isLoading = false;
        }, (err) => {
            console.log(err);
            // this.isLoading = false;
        });
    }


    assignTeacher(_scheduleItem) {
        // console.log(_scheduleItem);
        // {
        //     "schedule_id": "00a41cc8-e9e3-4a14-9a97-d10850f256c2",
        //     "start_time": "00:00:00",
        //     "end_time": "13:00:00",
        //     "teacher_id": "47b9a328-d654-43cc-8ac9-ca9f8ca9956d",
        //     "schedule_type": "weekly",
        //     "days": [
        //         "monday",
        //         "tuesday",
        //         "wednesday",
        //         "thursday",
        //         "friday"
        //     ]
        // }
        const postData = {
            start_date: this.data.start_date,
            end_date: this.data.end_date,
            new_teacher_id: _scheduleItem?.teacher_id,
            new_schedule_id: _scheduleItem?.schedule_id,
            start_time: _scheduleItem.start_time,
            end_time: _scheduleItem.end_time,
            order_id: this.data.order_id,
        }
        console.log(postData);

        this.apiService.transferStudentToOtherTeacher(postData).then(res=> {
            console.log(res);
            this.closeDetails();
            this.closeModal(true);
        }).catch(err => {
            console.log(err);
        })

    }

    toggleDetails(courseId: string): void {
        // If the teacher is already selected...
        if (this.selectedTeacher && this.selectedTeacher.teacher_id === courseId) {
            // Close the details
            this.selectedTeacher = null;
            this.closeDetails();
            return;
        }

        const _teacher = this.teacherList.find(f => f.teacher_id === courseId)
        /* console.log(_course) */

        // Set the selected teacher
        this.selectedTeacher = { ..._teacher };
        this._changeDetectorRef.markForCheck();

        /* console.log("this.selectedCourseForm -> ", this.selectedCourseForm)
        console.log("selectedCourseForm.get('subjects')['controls'] -> ", this.selectedCourseForm.get('subjects')['controls']) */
    }

    closeDetails(): void {
        this.selectedTeacher = null;
    }


    closeModal(_result) {
        this.dialogRef.close({ flag: _result });
    }

    time24To12(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }
}
