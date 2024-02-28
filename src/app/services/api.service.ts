import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { set } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    userLogin(postData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'adminLogin', postData);
    }


    //*  ----------------------->   Dashboard
    dashboardApiForAnalytics() {
        return this.http.get(environment.backendApiBaseUrl + 'dashboardApiForAnalytics');
    }


    //*  ----------------------->   Admins
    registrationAdmin(postData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'registrationAdmin', postData);
    }
    updateAdmin(postData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'updateAdmin', postData);
    }
    adminUploadImage(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'adminUploadImage', postFormData);
    }
    getAdmins() {
        return this.http.get(environment.backendApiBaseUrl + 'getAdminList');
    }
    getAdminById(admin_id) {
        let params = new HttpParams().set('admin_id', admin_id);
        return this.http.get(environment.backendApiBaseUrl + `getAdminById`, { params: params });
    }


    //*  ----------------------->   Students
    getUsersWithPagination(pageNo, searchInputValue) {
        let params = new HttpParams().set('pageNo', pageNo).set("searchInputValue", searchInputValue ? searchInputValue : '');
        return this.http.get(environment.backendApiBaseUrl + `student/getUsersWithPagination`, { params: params });
    }
    getStudentById(student_id) {
        let params = new HttpParams().set('student_id', student_id);
        return this.http.get(environment.backendApiBaseUrl + `student/getStudentById`, { params: params });
    }

    //*  ----------------------->   Courses
    getAllSubjectCourse() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllSubjectCourse');
    }
    getAllCourseWithSubject() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllCourseWithSubject');
    }
    getAllActiveCourseWithSubject() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllActiveCourseWithSubject');
    }
    addCourse(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'addCourse', postFormData);
    }
    updateCourseById(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'updateCourseById', postFormData);
    }
    updateSubjectById(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'updateSubjectById', postFormData);
    }
    addSubjectToCourse(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'addSubjectToCourse', postFormData);
    }
    deleteSubjectFromCourse(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'deleteSubjectFromCourse', postFormData);
    }


    //*  ----------------------->   Teachers
    registrationTeacher(postData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'registrationTeacher', postData);
    }
    getTeacherList() {
        return this.http.get(environment.backendApiBaseUrl + 'getTeacherList');
    }
    updateTeacher(postData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'updateTeacher', postData);
    }
    getTeacherById(teacher_id) {
        let params = new HttpParams().set('teacher_id', teacher_id);
        return this.http.get(environment.backendApiBaseUrl + `getTeacherById`, { params: params });
    }
    teacherUploadImage(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'teacherUploadImage', postFormData);
    }
    addCourseAndSubjectToTeacher(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'addCourseAndSubjectToTeacher', postFormData);
    }
    deleteCourseAndSubjectToTeacher(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'deleteCourseAndSubjectToTeacher', postFormData);
    }
    UpdateCourseAndSubjectToTeacherById(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'UpdateCourseAndSubjectToTeacherById', postFormData);
    }


    //*  ----------------------->   Subscriptions
    getAllSubscriptions() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllSubscriptions');
    }
    addSubscriptionPlan(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'addSubscriptionPlan', postFormData);
    }
    updateSubscriptionPlanById(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'updateSubscriptionPlanById', postFormData);
    }


    //*  ----------------------->   Schedules
    getAllTeacherSchedules() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllTeacherSchedules');
    }
    getAllScheduleByTeacherId(teacher_id) {
        let params = new HttpParams().set('teacher_id', teacher_id);
        return this.http.get(environment.backendApiBaseUrl + 'getAllScheduleByTeacherId', { params: params });
    }
    addSchedule(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'addSchedule', postFormData);
    }
    getTeacherSubscribersStudentByTeacherId(teacher_id) {
        let params = new HttpParams().set('teacher_id', teacher_id);
        return this.http.get(environment.backendApiBaseUrl + 'getTeacherSubscribersStudentByTeacherId', { params: params });
    }
    getAllTeacherSubscribersStudent() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllTeacherSubscribersStudent');
    }


    //*  ----------------------->   Orders
    getAllOrdersByTeacherId(teacher_id) {
        let params = new HttpParams().set('teacher_id', teacher_id);
        return this.http.get(environment.backendApiBaseUrl + 'getAllOrdersByTeacherId', { params: params });
    }
    getAllOrders() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllOrders');
    }
    getAllOngoingOrder() {
        return this.http.get(environment.backendApiBaseUrl + 'order/getAllOngoingOrder');
    }
    getAllHistoryOrder() {
        return this.http.get(environment.backendApiBaseUrl + 'order/getAllHistoryOrder');
    }
    getAllTodayOrdersByTeacherId(teacher_id) {
        let params = new HttpParams().set('teacher_id', teacher_id);
        return this.http.get(environment.backendApiBaseUrl + 'getAllTodayOrdersByTeacherId', { params: params });
    }
    getAllTodayOrders() {
        return this.http.get(environment.backendApiBaseUrl + 'getAllTodayOrders');
    }
    getTeacherListExceptTeacherId(teacher_id) {
        let params = new HttpParams().set('teacher_id', teacher_id);
        return this.http.get(environment.backendApiBaseUrl + 'getTeacherListExceptTeacherId', { params: params });
    }
    transferStudentToOtherTeacher(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'transferStudentToOtherTeacher', postFormData).toPromise();
    }

    //*  ----------------------->   Banner
    getBannerImages() {
        return this.http.get(environment.backendApiBaseUrl + 'getBannerImages');
    }

    uploadBannerImages(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'uploadBannerImages', postFormData).toPromise();
    }

    deleteBannerImage(postFormData: any) {
        return this.http.post(environment.backendApiBaseUrl + 'deleteBannerImage', postFormData).toPromise();
    }

    //*  ----------------------->   Notification
    getAdminNotificationByAdminId(admin_id, page) {
        let params = new HttpParams().set('admin_id', admin_id).set('page', page);
        return this.http.get(environment.backendApiBaseUrl + 'notification/getAdminNotificationByAdminId', { params: params }).toPromise();
    }
    markReadAllAdminNotificationByAdminId(admin_id) {
        return this.http.post(environment.backendApiBaseUrl + 'notification/markReadAllAdminNotificationByAdminId', { admin_id }).toPromise();
    }


    //* ------------------------> Common Data
    getHowToUseData() {
        return this.http.get(environment.backendApiBaseUrl + 'commonData/getHowToUseData').toPromise();
    }

    getHelpData() {
        return this.http.get(environment.backendApiBaseUrl + 'commonData/getHelpData').toPromise();
    }

    getTermsAndConditionsData() {
        return this.http.get(environment.backendApiBaseUrl + 'commonData/getTermsAndConditionsData').toPromise();
    }

    updateCommonData(postBody) {
        return this.http.post(environment.backendApiBaseUrl + 'commonData/updateCommonData', postBody).toPromise();
    }


    //* --------------------> order file
    getAllTransferTeacherRequest() {
        return this.http.get(environment.backendApiBaseUrl + 'order/getAllTransferTeacherRequest').toPromise();
    }

    rejectTransferTeacherRequest(changeTeacherRequestId) {
        return this.http.post(environment.backendApiBaseUrl + 'order/rejectTransferTeacherRequest', {change_teacher_request_id: changeTeacherRequestId}).toPromise();
    }

    acceptTransferTeacherRequest(postBody) {
        return this.http.post(environment.backendApiBaseUrl + 'order/acceptTransferTeacherRequest', postBody).toPromise();
    }
}
