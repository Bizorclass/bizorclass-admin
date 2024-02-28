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
    selector: 'courses-list',
    templateUrl: './courses-list.component.html',
    styleUrls: ['./courses-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class CoursesListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    courseList: any[] = [];

    flashMessage: 'success' | 'error' | null = null;

    isLoading: boolean = false;
    pagination = {
        "length": this.courseList.length,
        "size": 10,
        "page": 0,
        "lastPage": Math.ceil(this.courseList.length / 10),
        "startIndex": 0,
        "endIndex": 9
    };
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCourse: any | null = null;
    selectedCourseForm: UntypedFormGroup;

    user: any = null;
    isAccountActiveLoading: boolean = false;

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
        this.getAllCoursesFromServer();
    }

    defaultForm() {
        this.selectedCourseForm = this._formBuilder.group({
            course_id: [''],
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            /* subjects: this._formBuilder.array([]), */
            subjects: this._formBuilder.array([]),
        });
    }

    getAllCoursesFromServer() {
        this.apiService.getAllCourseWithSubject().subscribe(async (getAllSubjectCourseResponse: any) => {
            console.log(getAllSubjectCourseResponse);
            //todo update Object
            if (getAllSubjectCourseResponse.data) {
                let _courseList = getAllSubjectCourseResponse.data;
                for (var i = 0; i < _courseList.length; i++) {
                    _courseList[i].subjects = _courseList[i]['subject'];
                    delete _courseList[i].subject;
                }
                this.courseList = [..._courseList];
                this._changeDetectorRef.detectChanges();
            }
            this.selectedCourse = null;
            this.closeDetails();
            this.defaultForm();
        }, (err) => {
            console.log(err);
        });
    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
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

    toggleDetails(courseId: string): void {
        // If the product is already selected...
        if (this.selectedCourse && this.selectedCourse.course_id === courseId) {
            // Close the details
            this.selectedCourse = null;
            this.closeDetails();
            this.defaultForm();
            return;
        }

        this.defaultForm();
        const _course = this.courseList.find(f => f.course_id === courseId)
        /* console.log(_course) */

        // Set the selected product
        this.selectedCourse = { ..._course };
        this.selectedCourseForm.patchValue({ ..._course });


        const subjectsFormGroups = [];

        if (_course?.subjects?.length > 0) {
            _course.subjects.forEach((subjectItem) => {
                subjectsFormGroups.push(
                    this._formBuilder.group({
                        subject_id: [subjectItem.subject_id],
                        title: [subjectItem.title, [Validators.required]],
                        description: [subjectItem.description, [Validators.required]]
                    })
                );
            });
        }
        else {
            subjectsFormGroups.push(
                this._formBuilder.group({
                    title: ['', [Validators.required]],
                    description: ['', [Validators.required]]
                })
            );
        }
        subjectsFormGroups.forEach((subjectFormGroup) => {
            (this.selectedCourseForm.get('subjects') as UntypedFormArray).push(subjectFormGroup);
        });

        this._changeDetectorRef.markForCheck();

        /* console.log("this.selectedCourseForm -> ", this.selectedCourseForm)
        console.log("selectedCourseForm.get('subjects')['controls'] -> ", this.selectedCourseForm.get('subjects')['controls']) */
    }

    addSubjectField(): void {
        const subjectFormGroup = this._formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]]
        });

        (this.selectedCourseForm.get('subjects') as UntypedFormArray).push(subjectFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    closeDetails(): void {
        this.selectedCourse = null;
    }

    createCourse(): void {
        if (this.courseList.some(s => s.course_id === "new_course_id")) {
            this.toggleDetails("new_course_id");
            return;
        }
        const _newCourse = {
            course_id: "new_course_id",
            title: "",
            description: "",
            subjects: [
                {
                    title: "",
                    description: ""
                }
            ]
        };
        this.courseList.unshift({ ..._newCourse });
        this.toggleDetails("new_course_id");
    }

    updateSelectedCourse(): void {
        const _rawCourse = this.selectedCourseForm.getRawValue();

        if (_rawCourse.course_id === "new_course_id") {
            const coursePostObject = {
                title: _rawCourse.title,
                description: _rawCourse.description,
                admin_id: this.user.admin_id,
            }
            //todo post request to add new course
            console.log("coursePostObject => ", coursePostObject);
            this.apiService.addCourse(coursePostObject).subscribe(async (addCourseResponse: any) => {
                console.log(addCourseResponse);
                //todo update Object
                if (addCourseResponse.data) {
                    if (_rawCourse?.subjects && _rawCourse?.subjects.length > 0) {

                        _rawCourse?.subjects.forEach((subjectItem, _index) => {
                            const subjectPostObject = {
                                title: subjectItem.title,
                                description: subjectItem.description,
                                course_id: addCourseResponse.data.course_id,
                                admin_id: this.user.admin_id,
                            }
                            //todo post request to add new subject in course

                            this.apiService.addSubjectToCourse(subjectPostObject).subscribe((addCourseResponse: any) => {
                                console.log(addCourseResponse);
                                //todo update Object
                                if ((_rawCourse?.subjects.length - 1) === _index) {
                                    this.getAllCoursesFromServer();
                                }
                            }, (err) => {
                                console.log(err);
                            });
                        })
                    }
                }
            }, (err) => {
                console.log(err);
            });
        } else {
            const coursePostObject = {
                title: _rawCourse.title,
                description: _rawCourse.description,
                course_id: _rawCourse.course_id,
            }
            //todo post request to add new course
            console.log("coursePostObject => ", coursePostObject);
            this.apiService.updateCourseById(coursePostObject).subscribe(async (updateCourseByIdResponse: any) => {
                console.log(updateCourseByIdResponse);
                //todo update Object
                if (updateCourseByIdResponse.data) {
                    if (_rawCourse?.subjects && _rawCourse?.subjects.length > 0) {

                        // //todo For Delete Subject
                        for (const deleteSubjectItem of this.selectedCourse?.subjects?.filter(f => !_rawCourse?.subjects.some(s => s.subject_id === f.subject_id))) {
                            if (deleteSubjectItem?.subject_id) {
                                const deleteSubjectPostObject = {
                                    subject_id: deleteSubjectItem['subject_id']
                                }

                                const deleteSubjectFromCourseResponse = await this.apiService.deleteSubjectFromCourse(deleteSubjectPostObject).toPromise();
                                console.log("deleteSubjectFromCourseResponse => ", deleteSubjectFromCourseResponse);
                            } else {
                                console.error("deleteSubjectItem => ", deleteSubjectItem);
                            }
                        }

                        // //todo For Insert And Update Subject
                        for (const insertSubjectItem of _rawCourse?.subjects) {
                            if (!insertSubjectItem?.subject_id) {
                                const subjectPostObject = {
                                    title: insertSubjectItem.title,
                                    description: insertSubjectItem.description,
                                    course_id: updateCourseByIdResponse.data.course_id,
                                    admin_id: this.user.admin_id,
                                }

                                const addSubjectToCourseResponse = await this.apiService.addSubjectToCourse(subjectPostObject).toPromise();
                                console.log("addSubjectToCourseResponse => ", addSubjectToCourseResponse);
                            } else {
                                const subjectPostObject = {
                                    title: insertSubjectItem.title,
                                    description: insertSubjectItem.description,
                                    subject_id: insertSubjectItem?.subject_id
                                }

                                const updateSubjectByIdResponse = await this.apiService.updateSubjectById(subjectPostObject).toPromise();
                                console.log("updateSubjectByIdResponse => ", updateSubjectByIdResponse);
                            }
                        }

                        this.getAllCoursesFromServer();
                        console.log("END");
                    }
                }
            }, (err) => {
                console.log(err);
            });
        }

        /* console.log(_rawCourse) */
    }

    async activeStatusChange(_courseId: string) {

        let selectedCourse = this.courseList.find(f => f.course_id === _courseId);

        const postObject = {
            course_id: _courseId,
            is_course_active: !selectedCourse?.is_course_active
        }
        try {
            this.isAccountActiveLoading = true;
            this._changeDetectorRef.detectChanges();
            const updateCourseResponse: any = await this.apiService.updateCourseById(postObject).toPromise();
            console.log("updateCourseResponse => ", updateCourseResponse);
            if (updateCourseResponse.data) {
                selectedCourse.is_course_active = updateCourseResponse.data.is_course_active;
                let message = "Course in-active successfully.";
                if (updateCourseResponse.data.is_course_active) {
                    message = "Course active successfully.";
                }
                this._snackBar.open(message, "", {
                    horizontalPosition: "center",
                    verticalPosition: "top",
                    duration: 3000,
                    panelClass: ['success-toast']
                    // panelClass: ['error-toast']
                })
            } else {
                throw updateCourseResponse;
            }
            this.isAccountActiveLoading = false;
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
            this.isAccountActiveLoading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    async removeSubjectField(index: number) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete subject',
            message: 'Are you sure you want to delete this subject? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const subjectsFormArray = this.selectedCourseForm.get('subjects') as UntypedFormArray;
                subjectsFormArray.removeAt(index);
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    deleteSelectedProduct(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message: 'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {

                // Get the product object
                const product = this.selectedCourseForm.getRawValue();

                // Delete the product on the server
                this._inventoryService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
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
}
