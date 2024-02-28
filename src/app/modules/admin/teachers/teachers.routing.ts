import { Route } from '@angular/router';
import { CanDeactivateTeachersDetails } from 'app/modules/admin/teachers/teachers.guards';
import { TeachersComponent } from 'app/modules/admin/teachers/teachers.component';
import { TeachersListComponent } from 'app/modules/admin/teachers/list/list.component';
import { TeachersDetailsComponent } from 'app/modules/admin/teachers/details/details.component';

export const teachersRoutes: Route[] = [
    {
        path     : '',
        component: TeachersComponent,
        // resolve  : {
        //     tags: AdminsTagsResolver
        // },
        children : [
            {
                path     : '',
                component: TeachersListComponent,
                // resolve  : {
                //     admins : AdminsResolver,
                //     countries: AdminsCountriesResolver
                // },
                children : [
                    {
                        path         : ':id',
                        component    : TeachersDetailsComponent,
                        // resolve      : {
                        //     contact  : AdminsContactResolver,
                        //     countries: AdminsCountriesResolver
                        // },
                        canDeactivate: [CanDeactivateTeachersDetails]
                    }
                ]
            }
        ]
    }
];
