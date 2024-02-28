import { Route } from '@angular/router';
import { CoursesComponent } from 'app/modules/admin/courses-page/courses/courses.component';
import { CoursesListComponent } from 'app/modules/admin/courses-page/courses/list/courses-list.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/courses-page/courses/courses.resolvers';

export const coursesRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'courses-list'
    },
    {
        path     : 'courses-list',
        component: CoursesComponent,
        children : [
            {
                path     : '',
                component: CoursesListComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver
                }
            }
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
