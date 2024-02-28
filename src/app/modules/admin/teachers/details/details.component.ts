import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TeachersListComponent } from 'app/modules/admin/teachers/list/list.component';
import { TeachersService } from 'app/modules/admin/teachers/teachers.service';
import { passwordValidator } from 'app/shared/password.validator';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoardList, LanguagesList } from "../../../../services/defaultValues.js";

@Component({
    selector: 'teachers-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachersDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    editMode: boolean = false;
    serverCoursesAndSubject: any[] = [];

    teacher_id = null;
    teacherObject: any;
    teacherForm: UntypedFormGroup;
    avatarObject = null;

    isAccountActiveLoading: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    BoardList: string[] = BoardList;
    LanguagesList: string[] = LanguagesList;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _teachersListComponent: TeachersListComponent,
        private apiService: ApiService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private domSanitizer: DomSanitizer,
        private _snackBar: MatSnackBar
    ) {
        this.getCoursesAndSubjectFromServer();
        this._activatedRoute.params.subscribe(params => {
            this.teacher_id = params["id"];
            if (this.teacher_id === "createTeacher") {
                this.toggleEditMode(true);
            } else {
                this.getTeacherFromServer();
            }
        });
    }

    ngOnInit(): void {
        // Open the drawer
        this._teachersListComponent.matDrawer.open();

        // Create the teacherObject form
        this.resetTeacherForm();
    }

    resetTeacherForm() {
        if (this.teacherForm) {
            this.teacherForm = null;
        }
        this.teacherForm = this._formBuilder.group({
            first_name: ["", Validators.required],
            is_vaccinated: [false, Validators.required],
            last_name: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            year_experience: ["", Validators.required],
            degree: ["", Validators.required],
            about_description: ["", Validators.required],
            teacher_subject_description: ["", Validators.required],
            linkedin_link: ["", Validators.required],
            subjects: this._formBuilder.array([]),
            board: ["", Validators.required],
            city: ["", Validators.required],
            language: ["", Validators.required],
            password: ["", passwordValidator()]
        });

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getCoursesAndSubjectFromServer() {
        // this.serverCoursesAndSubject = [
        //     {
        //         course_id : "1",
        //         title : "MPSC",
        //         subjects: [
        //             {
        //                 subject_id: "1 1",
        //                 title : "Math",
        //             },
        //             {
        //                 subject_id: "1 2",
        //                 title : "Economy",
        //             },
        //             {
        //                 subject_id: "1 3",
        //                 title : "History",
        //             },
        //             {
        //                 subject_id: "1 4",
        //                 title : "Science",
        //             },
        //         ]
        //     },
        //     {
        //         course_id : "2",
        //         title : "1st - 5th standard",
        //         subjects: [
        //             {
        //                 subject_id: "2 1",
        //                 title : "Math",
        //             },
        //             {
        //                 subject_id: "2 2",
        //                 title : "English",
        //             },
        //             {
        //                 subject_id: "2 3",
        //                 title : "MArathi",
        //             },
        //             {
        //                 subject_id: "2 4",
        //                 title : "Hindi",
        //             },
        //         ]
        //     }
        // ];

        this.apiService.getAllActiveCourseWithSubject().subscribe(async (getAllSubjectCourseResponse: any) => {
            // console.log(getAllSubjectCourseResponse);
            //todo update Object
            if (getAllSubjectCourseResponse.data) {
                let _courseList = getAllSubjectCourseResponse.data.filter(f => f?.subject?.length > 0);
                for (var i = 0; i < _courseList.length; i++) {
                    _courseList[i].subjects = _courseList[i]['subject'];
                    delete _courseList[i].subject;
                }
                this.serverCoursesAndSubject = [..._courseList];
                // this._changeDetectorRef.detectChanges();
                console.log(this.serverCoursesAndSubject);

            }
        }, (err) => {
            console.log(err);
        });
    }

    getTeacherFromServer() {
        //todo get Admin From server query (this.teacher_id)

        // let obj = {
        //     teacher_id: "abc",
        //     first_name: "Pankaj",
        //     last_name: "Agade",
        //     email: "pankaj@gmail.com",
        //     photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
        //     year_experience: 5,
        //     degree: "Engineering",
        //     about_description: "sort life",
        //     linkedin_link: "du soicjvnc nvonsv.",
        //     subjects : [
        //         {
        //             subject_teacher_relation_id: "2121212121",
        //             subject_id: "1 1",
        //             teacher_id: "acg",
        //             price: 200
        //         },
        //         {
        //             subject_teacher_relation_id: "9998989",
        //             subject_id: "2 1",
        //             teacher_id: "acg",
        //             price: 500
        //         },
        //     ],

        // }
        // this.teacherObject = {...obj};
        this.apiService.getTeacherById(this.teacher_id).subscribe(async (getAdminByIdResponse: any) => {
            // console.log(getAdminByIdResponse);
            //todo update Object
            if (getAdminByIdResponse.data) {
                this.toggleEditMode(false);
                let _teacherObject = Array.isArray(getAdminByIdResponse.data) ? getAdminByIdResponse.data[0] : getAdminByIdResponse.data;
                _teacherObject.subjects = _teacherObject["teacher-subject"];
                delete _teacherObject["teacher-subject"];
                this.teacherObject = _teacherObject;
                this._changeDetectorRef.markForCheck();
                console.log(this.teacherObject);
                this.resetTeacherForm();
            }
        }, (err) => {
            console.log(err);
        });
    }

    onSubjectChange(subjectItem) {
        console.log(subjectItem);
        if (this.teacherForm.get('subjects').value.find(f => f.subject_id === subjectItem.subject_id)) {
            const index = this.teacherForm.get('subjects').value.findIndex(f => f.subject_id === subjectItem.subject_id);
            const subjectFormArray = this.teacherForm.get('subjects') as UntypedFormArray;
            subjectFormArray.removeAt(index);
        } else {
            const subjectFormGroup = this._formBuilder.group({
                subject_id: [subjectItem.subject_id, [Validators.required]],
                teacher_id: [this.teacher_id, [Validators.required]],
                // price: [NaN, [Validators.required]],
                // price: [NaN],
            });
            (this.teacherForm.get('subjects') as UntypedFormArray).push(subjectFormGroup);
        }
        this._changeDetectorRef.markForCheck();
        console.log(this.teacherForm);
        console.log(this.teacherForm.get('subjects').value);

    }
    isCheckedSubject(_subjectItem, _FormSubjects) {
        // console.log({_subjectItem, _FormSubjects});
        return Boolean(_FormSubjects.value.find(f => f.subject_id === _subjectItem.subject_id));
    }
    // isPriceSubject(_subjectItem, _FormSubjects) {
    //     // console.log({_subjectItem, _FormSubjects});
    //     return _FormSubjects.value.find(f => f.subject_id === _subjectItem.subject_id)?.price || "";
    // }
    // setPriceSubject(_subjectItem, _FormSubjects, event) {
    //     // if (_FormSubjects.value.find(f => f.subject_id === _subjectItem.subject_id)) {
    //     //     _FormSubjects.value.find(f => f.subject_id === _subjectItem.subject_id).price = event.target.value;
    //     //     // let c:any = this.teacherForm.value.find(f => f.subject_id === _subjectItem.subject_id)
    //     //     // c?.price = event.target.value;
    //     // }

    //     return this.teacherForm.get("subjects")['controls']?.find(f => f.value.subject_id === _subjectItem.subject_id)?.get("price") || null;
    //     // console.log("dsds");

    // }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._teachersListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else if (!editMode) {
            this.editMode = false;
            this.resetTeacherForm();
        } else if (editMode) {

            this.editMode = editMode;
            if (this.teacherObject) {
                this.teacherForm.patchValue({ ...this.teacherObject });
                this.teacherForm.removeControl("password");
                this.teacherForm.get('email')?.disable();
            }

            const subjectsFormGroups = [];
            if (this.teacherObject?.subjects?.length > 0) {
                this.teacherObject?.subjects.forEach((subjectItem) => {
                    subjectsFormGroups.push(
                        this._formBuilder.group({
                            // subject_teacher_relation_id: "9998989",
                            // subject_id: "2 1",
                            // teacher_id: "acg",
                            // price: 500
                            "teacher-subject_id": [subjectItem["teacher-subject_id"]],
                            subject_id: [subjectItem.subject_id.subject_id, [Validators.required]],
                            teacher_id: [subjectItem.teacher_id, [Validators.required]],
                            // price: [subjectItem.price, [Validators.required]],
                            // price: [subjectItem.price],
                        })
                    );
                });
            }
            subjectsFormGroups.forEach((subjectFormGroup) => {
                (this.teacherForm.get('subjects') as UntypedFormArray).push(subjectFormGroup);
            });

            console.log(this.teacherForm);
        }
        this._changeDetectorRef.markForCheck();
    }


    async updateContact(): Promise<void> {
        // Get the teacherObject object
        console.log(this.teacherForm);
        const teacherObject = this.teacherForm.getRawValue();
        console.log(teacherObject);

        if (this.teacherForm.valid) {
            if (this.teacher_id === "createTeacher" && teacherObject) { //* for Add Admin
                console.log(teacherObject);
                //todo add Admin query
                this.apiService.registrationTeacher({ email: teacherObject.email, password: teacherObject.password }).subscribe((res: any) => {
                    console.log(res);
                    //todo update Object
                    if (res.data) {
                        let postObject = {
                            teacher_id: res.data.teacher_id,
                            first_name: this.capitalizeFirstLetter(teacherObject.first_name),
                            last_name: this.capitalizeFirstLetter(teacherObject.last_name),
                            about_description: teacherObject?.about_description || "",
                            teacher_subject_description: teacherObject?.teacher_subject_description || "",
                            degree: teacherObject?.degree || "",
                            year_experience: teacherObject?.year_experience || "",
                            linkedin_link: teacherObject?.linkedin_link || "",
                            is_vaccinated: teacherObject?.is_vaccinated || false,
                        };
                        this.updateTeacherQuery(postObject, teacherObject.subjects);
                    } else {
                        // alert(res?.error?.message);
                        if (res?.error?.message?.toLowerCase()?.includes('email address has already been registered')) {
                            this.teacherForm.get("email").setErrors({ serverError: "Email address already registered by another user" });
                            this._snackBar.open("Email address already registered by another user", "", {
                                horizontalPosition: "center",
                                verticalPosition: "top",
                                duration: 3000,
                                // panelClass: ['success-toast']
                                panelClass: ['error-toast']
                            })
                            this._changeDetectorRef.markForCheck();
                        } else {
                            this._snackBar.open("Something went wrong! Try again", "", {
                                horizontalPosition: "center",
                                verticalPosition: "top",
                                duration: 3000,
                                // panelClass: ['success-toast']
                                panelClass: ['error-toast']
                            })
                        }
                    }
                }, (err) => {
                    console.log(err);
                });
            } else {  //* for update teacher
                let postObject = {
                    teacher_id: this.teacher_id,
                    first_name: this.capitalizeFirstLetter(teacherObject.first_name),
                    last_name: this.capitalizeFirstLetter(teacherObject.last_name),
                    about_description: teacherObject?.about_description || "",
                    teacher_subject_description: teacherObject?.teacher_subject_description || "",
                    board: teacherObject?.board || [],
                    city: teacherObject?.city || "",
                    is_vaccinated: teacherObject?.is_vaccinated || false,
                    language: teacherObject?.language || [],
                    degree: teacherObject?.degree || "",
                    year_experience: teacherObject?.year_experience || "",
                    linkedin_link: teacherObject?.linkedin_link || "",
                };
                this.updateTeacherQuery(postObject, teacherObject.subjects);
            }
        } else {
            console.log(this.teacherForm);
        }

        // this.toggleEditMode(false);
    }

    updateTeacherQuery(postObject: any, _subjects: any[]) {
        console.log({ _subjects });
        this.apiService.updateTeacher(postObject).subscribe(async (res: any) => {
            console.log(res);
            let done = false;
            //todo update Object
            if (res.data) {
                if (this.avatarObject) {
                    //todo add photo Admin query
                    const file: any = await this.convertImageFileToWebpFile(this.avatarObject);
                    let bodyForUploadImage = new FormData();
                    bodyForUploadImage.append('photo', file, `${res.data.teacher_id}.webp`);
                    bodyForUploadImage.append('id', res.data.teacher_id);
                    const updateAdminResponse: any = await this.apiService.teacherUploadImage(bodyForUploadImage).toPromise();
                    console.log(updateAdminResponse);
                    //todo update Object
                    if (updateAdminResponse.data) {
                        if (!done) {
                            done = true;
                            this.toggleEditMode(false);
                            this._router.navigate(['../', res.data.teacher_id], { relativeTo: this._activatedRoute });
                            this.getTeacherFromServer();
                            this._changeDetectorRef.markForCheck();
                        }
                    } else {
                        console.error("updateAdminResponse ", updateAdminResponse);
                        throw updateAdminResponse;
                    }
                }

                if (_subjects.length > 0) {

                    //todo For Delete Subject
                    if (this.teacherObject?.subjects?.length > 0) {
                        for (const deleteSubjectItem of this.teacherObject?.subjects?.filter(f => !_subjects.some(s => s.subject_id === f.subject_id.subject_id))) {
                            if (deleteSubjectItem['teacher-subject_id']) {
                                const deleteSubjectPostObject = {
                                    teacher_subject_id: deleteSubjectItem['teacher-subject_id']
                                }

                                const deleteCourseAndSubjectToTeacherResponse = await this.apiService.deleteCourseAndSubjectToTeacher(deleteSubjectPostObject).toPromise();
                                console.log("deleteCourseAndSubjectToTeacherResponse => ", deleteCourseAndSubjectToTeacherResponse);
                            } else {
                                console.error("deleteSubjectItem => ", deleteSubjectItem);
                                throw deleteSubjectItem;
                            }
                        }
                    }

                    //todo For Insert Subject
                    for (const insertSubjectItem of _subjects.filter(f => !this.teacherObject?.subjects?.some(s => s.subject_id.subject_id === f.subject_id))) {
                        if (insertSubjectItem?.subject_id) {
                            const insertSubjectPostObject = {
                                subject_id: insertSubjectItem.subject_id,
                                teacher_id: res.data.teacher_id,
                            }

                            const addCourseAndSubjectToTeacherResponse = await this.apiService.addCourseAndSubjectToTeacher(insertSubjectPostObject).toPromise();
                            console.log("addCourseAndSubjectToTeacherResponse => ", addCourseAndSubjectToTeacherResponse);


                        } else {
                            console.error("insertSubjectItem => ", insertSubjectItem);
                            throw insertSubjectItem;
                        }
                    }

                }
                console.log("END");
                if (this.teacher_id === "createTeacher") {
                    this._snackBar.open("Teacher added successfully.", "", {
                        horizontalPosition: "center",
                        verticalPosition: "top",
                        duration: 3000,
                        panelClass: ['success-toast']
                        // panelClass: ['error-toast']
                    });
                } else {
                    this._snackBar.open("Teacher updated successfully.", "", {
                        horizontalPosition: "center",
                        verticalPosition: "top",
                        duration: 3000,
                        panelClass: ['success-toast']
                        // panelClass: ['error-toast']
                    });
                }

                this.toggleEditMode(false);
                this._router.navigate(['../', res.data.teacher_id], { relativeTo: this._activatedRoute });
                this.getTeacherFromServer();
                this._changeDetectorRef.markForCheck();
            }
        }, (err) => {
            console.error(err);
            this._snackBar.open("Something went wrong! Try again", "", {
                horizontalPosition: "center",
                verticalPosition: "top",
                duration: 3000,
                // panelClass: ['success-toast']
                panelClass: ['error-toast']
            })
        });
    }

    vaccinateStatusChange(e) {
        console.log(e.checked);
        this.teacherForm.get('is_vaccinated').setValue(e.checked);
    }

    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete teacherObject',
            message: 'Are you sure you want to delete this teacherObject? This action cannot be undone!',
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
                // // Get the current teacherObject's id
                // const id = this.teacherObject.id;

                // // Get the next/previous teacherObject's id
                // const currentContactIndex = this.teachers.findIndex(item => item.id === id);
                // const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.teachers.length - 1)) ? -1 : 1);
                // const nextContactId = (this.teachers.length === 1 && this.teachers[0].id === id) ? null : this.teachers[nextContactIndex].id;

                // // Delete the teacherObject
                // this._teachersService.deleteContact(id)
                //     .subscribe((isDeleted) => {

                //         // Return if the teacherObject wasn't deleted...
                //         if ( !isDeleted )
                //         {
                //             return;
                //         }

                //         // Navigate to the next teacherObject if available
                //         if ( nextContactId )
                //         {
                //             this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
                //         }
                //         // Otherwise, navigate to the parent
                //         else
                //         {
                //             this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                //         }

                //         // Toggle the edit mode off
                //         this.toggleEditMode(false);
                //     });

                // // Mark for check
                // this._changeDetectorRef.markForCheck();
            }
        });

    }

    goBack() {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        console.log("file -> ", file);
        this.avatarObject = file;
    }

    async activeStatusChange() {
        const postObject = {
            teacher_id: this.teacher_id,
            is_account_active: !this.teacherObject?.is_account_active
        }
        try {
            this.isAccountActiveLoading = true;
            this._changeDetectorRef.detectChanges();
            const updateTeacherResponse: any = await this.apiService.updateTeacher(postObject).toPromise();
            console.log("updateTeacherResponse => ", updateTeacherResponse);
            if (updateTeacherResponse.data) {
                this.teacherObject.is_account_active = updateTeacherResponse.data.is_account_active;
                let message = "Teacher in-active successfully.";
                if (updateTeacherResponse.data.is_account_active) {
                    message = "Teacher active successfully.";
                }
                this._snackBar.open(message, "", {
                    horizontalPosition: "center",
                    verticalPosition: "top",
                    duration: 3000,
                    panelClass: ['success-toast']
                    // panelClass: ['error-toast']
                })
            } else {
                throw updateTeacherResponse;
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

    removeAvatar(): void {

    }

    imageFileTOString(_fileObj) {
        if (typeof _fileObj === "string") {
            return _fileObj;
        } else {
            let _str: any = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(_fileObj));
            //   console.log(_str);
            return _str;
        }
    }

    capitalizeFirstLetter(str: string) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    convertImageFileToWebpFile(file) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                canvas.getContext('2d').drawImage(image, 0, 0);
                canvas.toBlob((blob) => {
                    let myFile = new File([blob], 'my-new-group-image.webp', {
                        type: blob.type,
                    });
                    resolve(myFile);
                }, 'image/webp');
            };
            image.crossOrigin = 'anonymous';
            image.src = URL.createObjectURL(file);
        });
    }
}
