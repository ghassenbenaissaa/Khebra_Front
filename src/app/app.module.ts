// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

// project import
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { GuestComponent } from './layouts/guest-layout/guest.component';
import { AdminComponent } from './layouts/admin-layout/admin.component';
import {PublicLayoutComponent} from "./layouts/user-layout/public-layout.component";
import { NavBarComponent } from './layouts/admin-layout/nav-bar/nav-bar.component';
import { NavigationComponent } from './layouts/admin-layout/navigation/navigation.component';
import { NavLeftComponent } from './layouts/admin-layout/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './layouts/admin-layout/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './layouts/admin-layout/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './layouts/admin-layout/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './layouts/admin-layout/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './layouts/admin-layout/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './layouts/admin-layout/navigation/nav-content/nav-item/nav-item.component';
import { NavSearchComponent } from './layouts/admin-layout/nav-bar/nav-left/nav-search/nav-search.component';
import { NavigationItem } from './layouts/admin-layout/navigation/navigation';
import { ToggleFullScreenDirective } from './shared/components/full-screen/toggle-full-screen';
import {HomeComponent} from "./features/front/home/home.component";
import {ExpertComponent} from "./features/front/experts/expert.component";
import {ExpertDetailsComponent} from "./features/front/expert-details/expert-details.component";
import {CountersComponent} from "./features/front/counters/counters.component";
import {ComingSoonComponent} from "./features/front/coming-soon/coming-soon.component";
import {ErrorComponent} from "./features/front/error/error.component";
import {NavbarComponent} from "./layouts/user-layout/navbar/navbar.component";
import {FooterComponent} from "./layouts/user-layout/footer/footer.component";
import {CarouselModule} from "ngx-owl-carousel-o";
import {NgxScrollTopModule} from "ngx-scrolltop";
import {NgCircleProgressModule} from "ng-circle-progress";
import {ProfileComponent} from "./features/front/profile/profile.component";
import {AuthInterceptor} from "./core/interceptors/auth.interceptor";
import { ExpertFiltersComponent } from './features/front/expert-filters/expert-filters.component';
import {SidebarComponent} from "./layouts/user-layout/sidebar/sidebar.component";
import {TruncatePipe} from "./core/pipes/truncate.pipe";

import {NotificationComponent} from "./shared/components/notification/notification.component";


@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    AdminComponent,
    PublicLayoutComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavLogoComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    NavSearchComponent,
    ToggleFullScreenDirective,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ExpertComponent,
    ExpertDetailsComponent,
    CountersComponent,
    ErrorComponent,
    ComingSoonComponent,
    ProfileComponent,
    ExpertFiltersComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    CarouselModule,
    NgxScrollTopModule,
    NgCircleProgressModule.forRoot({}),
    HttpClientModule,
    SidebarComponent,
    NotificationComponent,
    ToastrModule.forRoot(),
  ],
  providers: [NavigationItem,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
