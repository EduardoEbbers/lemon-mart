import { SecurityContext } from "@angular/core";
import { MediaChange } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { SafeResourceUrl, SafeValue } from "@angular/platform-browser";
import { Observable, Subscription, of } from "rxjs";
import { MaterialModule } from "../material.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuthService } from "../auth/auth.service";
import { autoSpyObj } from 'angular-unit-test-helper';
import { UiService } from "./ui.service";

const FAKE_SVGS = {
    lemon: '<svg><path id="lemon" name="lemon"></path></svg>'
};

export class MediaObserverFake {
    isActive(query: string): boolean {
        return false;
    }

    asObservable(): Observable<MediaChange> {
        return of({} as MediaChange);
    }

    subscribe(next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return new Subscription();
    }
}

export class MatIconRegistryFake {
    //tslint: disable-next-line: variable-name
    _document = document;
    addSvgIcon(iconName: string, url: SafeResourceUrl): this {
        //this.addSvgIcon('lemon', 'lemon.svg')
        return this;
    }

    getNameSvgIcon(name: string, namespace: string = ''): Observable<SVGElement> {
        return of(this._svgNamedSvgIcon(FAKE_SVGS.lemon));
    }

    private _svgNamedSvgIcon(str: string): SVGElement {
        const div = (this._document || document).createElement('div');
        div.innerHTML = str;
        const svg = div.querySelector('svg') as SVGElement
        if(!svg) {
            throw Error('<svg> tag not found');
        }
        return svg;
    }
}

export class DomSanitizerFake {
    bypassSecurityTrustResourceUrl(url: string): SafeResourceUrl {
        return {} as SafeResourceUrl;
    }

    sanitize(context: SecurityContext, value: SafeValue | string | null): string | null {
        return value?.toString() || null;
    }
}

export const commonTestingProviders: any[] = [
    { provide: AuthService, userValue: autoSpyObj(AuthService) },
    { provide: AuthService, userValue: autoSpyObj(UiService) },
];

export const commonTestingModules: any[] = [
    ReactiveFormsModule,
    MaterialModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule
];