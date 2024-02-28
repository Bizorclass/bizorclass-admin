import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminsService
{
    // Private
    private _contact: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _admins: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<any>
    {
        return this._contact.asObservable();
    }

    /**
     * Getter for admins
     */
    get admins$(): Observable<any[]>
    {
        return this._admins.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<any[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<any[]>
    {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get admins
     */
    getAdmins(): Observable<any[]>
    {
        return this._httpClient.get<any[]>('api/apps/contacts/all').pipe(
            tap((admins) => {
                this._admins.next(admins);
            })
        );
    }

    /**
     * Search admins with given query
     *
     * @param query
     */
    searchAdmins(query: string): Observable<any[]>
    {
        return this._httpClient.get<any[]>('api/apps/contacts/search', {
            params: {query}
        }).pipe(
            tap((admins) => {
                this._admins.next(admins);
            })
        );
    }

    /**
     * Get contact by id
     */
    getContactById(id: string): Observable<any>
    {
        return this._admins.pipe(
            take(1),
            map((admins) => {

                // Find the contact
                const contact = admins.find(item => item.id === id) || null;

                // Update the contact
                this._contact.next(contact);

                // Return the contact
                return contact;
            }),
            switchMap((contact) => {

                if ( !contact )
                {
                    return throwError('Could not found contact with id of ' + id + '!');
                }

                return of(contact);
            })
        );
    }

    /**
     * Create contact
     */
    createContact(): Observable<any>
    {
        return this.admins$.pipe(
            take(1),
            switchMap(admins => this._httpClient.post<any>('api/apps/contacts/contact', {}).pipe(
                map((newContact) => {
                    console.log(newContact);

                    // Update the admins with the new contact
                    this._admins.next([newContact, ...admins]);

                    // Return the new contact
                    return newContact;
                })
            ))
        );
    }

    /**
     * Update contact
     *
     * @param id
     * @param contact
     */
    updateContact(id: string, contact: any): Observable<any>
    {
        return this.admins$.pipe(
            take(1),
            switchMap(admins => this._httpClient.patch<any>('api/apps/contacts/contact', {
                id,
                contact
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = admins.findIndex(item => item.id === id);

                    // Update the contact
                    admins[index] = updatedContact;

                    // Update the admins
                    this._admins.next(admins);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: string): Observable<boolean>
    {
        return this.admins$.pipe(
            take(1),
            switchMap(admins => this._httpClient.delete('api/apps/contacts/contact', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted contact
                    const index = admins.findIndex(item => item.id === id);

                    // Delete the contact
                    admins.splice(index, 1);

                    // Update the admins
                    this._admins.next(admins);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Get countries
     */
    getCountries(): Observable<any[]>
    {
        return this._httpClient.get<any[]>('api/apps/contacts/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }

    /**
     * Get tags
     */
    getTags(): Observable<any[]>
    {
        return this._httpClient.get<any[]>('api/apps/contacts/tags').pipe(
            tap((tags) => {
                this._tags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: any): Observable<any>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<any>('api/apps/contacts/tag', {tag}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                })
            ))
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: any): Observable<any>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<any>('api/apps/contacts/tag', {
                id,
                tag
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
                })
            ))
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/contacts/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.admins$.pipe(
                    take(1),
                    map((admins) => {

                        // Iterate through the admins
                        admins.forEach((contact) => {

                            const tagIndex = contact.tags.findIndex(tag => tag === id);

                            // If the contact has the tag, remove it
                            if ( tagIndex > -1 )
                            {
                                contact.tags.splice(tagIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    })
                ))
            ))
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: string, avatar: File): Observable<any>
    {
        return this.admins$.pipe(
            take(1),
            switchMap(admins => this._httpClient.post<any>('api/apps/contacts/avatar', {
                id,
                avatar
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': avatar.type
                }
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = admins.findIndex(item => item.id === id);

                    // Update the contact
                    admins[index] = updatedContact;

                    // Update the admins
                    this._admins.next(admins);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }
}
