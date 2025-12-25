import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './extrapages/page404/page404.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './layouts/layout.component';

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () =>
            import("./account/account.module").then((m) => m.AccountModule),
    },
    {
        path: "admin",
        component: LayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] },
        loadChildren: () =>
            import("./admin/admin.module").then((m) => m.AdminModule),
    },
    {
        path: "teacher",
        component: LayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['teacher'] },
        loadChildren: () =>
            import("./teacher/teacher.module").then((m) => m.TeacherModule),
    },
    {
        path: "student",
        component: LayoutComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['student'] },
        loadChildren: () =>
            import("./student/student.module").then((m) => m.StudentModule),
    },
    {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full"
    },
    {
        path: "dashboard",
        component: LayoutComponent,
        loadChildren: () =>
            import("./pages/pages.module").then((m) => m.PagesModule),
        canActivate: [AuthGuard],
    },
    {
        path: "pages",
        component: LayoutComponent,
        loadChildren: () =>
            import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
        canActivate: [AuthGuard],
    },
    { path: "crypto-ico-landing", component: CyptolandingComponent },
    { path: "**", component: Page404Component },
];
