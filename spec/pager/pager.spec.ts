/**
 * Pager spec 
 */

import { L10n, EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base/dom';
import { Pager } from '../../src/pager/pager';
import { ExternalMessage } from '../../src/pager/external-message';
import '../../node_modules/es6-promise/dist/es6-promise';

Pager.Inject(ExternalMessage);

describe('Pager base module', () => {

    describe('Pager properties testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            L10n.load({
            'de-DE': {
                'pager': {
                    'currentPageInfo': '{0} van {1} pagina',
                    'totalItemsInfo': '( {0} items)',
                    'firstPageTooltip': 'Ga naar de eerste pagina',
                    'lastPageTooltip': 'Ga naar de laatste pagina',
                    'nextPageTooltip': 'Ga naar de volgende pagina',
                    'previousPageTooltip': 'Ga naar de vorige pagina',
                    'nextPagerTooltip': 'Ga naar de volgende pager',
                    'previousPagerTooltip': 'Ga naar vorige pager'
                }
            }
        });
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, locale: 'de-DE',
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                     enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });

            pagerObj.appendTo('#Pager');
        });

        it('current page testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('8');
        });

        it('page count testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toEqual(5);
        });

        it('enable pager message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toEqual(1);
        });

        it('enable pager message testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('8 van 20 pagina ( 100 items)');
        });

        it('enable pager external message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(1);
        });

        it('enable pager external message testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('externalMessage');
        });

        it('class testing', () => {
            expect(pagerObj.element.classList.contains('e-pager')).toEqual(true);
        });

        it('rtl testing', () => {
            expect(pagerObj.element.classList.contains('e-rtl')).toEqual(true);
        });

        it('custom text testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].textContent).toEqual('sheet8');
        });

        it('current page value testing', () => {
            expect(pagerObj.currentPage).toEqual(8);
        });

        it('totalRecordsCount value testing', () => {
            expect(pagerObj.totalRecordsCount).toEqual(100);
        });

        it('pageCount value testing', () => {
            expect(pagerObj.pageCount).toEqual(5);
        });

        it('pageSize value testing', () => {
            expect(pagerObj.pageSize).toEqual(5);
        });

        it('enableExternalMessage value testing', () => {
            expect(pagerObj.enableExternalMessage).toEqual(true);
        });

        it('enablePagerMessage value testing', () => {
            expect(pagerObj.enablePagerMessage).toEqual(true);
        });

        it('externalMessage value testing', () => {
            expect(pagerObj.externalMessage).toEqual('externalMessage');
        });      

        it('enableRtl value testing', () => {
            expect(pagerObj.enableRtl).toEqual(true);
        });

        it('enableQueryString value testing', () => {
            expect(pagerObj.enableQueryString).toEqual(true);
        });

        it('locale value testing', () => {
            expect(pagerObj.locale).toEqual('de-DE');
        });

        it('querystring testing', () => {
            pagerObj.goToPage(10);
            expect(window.location.href.indexOf('?page=10')).toBeGreaterThan(-1);
        });

        it('pager button visibility testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-disable').length).toEqual(0);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('Empty pager control testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager({ created: created });
            pagerObj.appendTo('#Pager');
        });

        it('pager message testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('0 of 0 pages (0 items)');
        });

        it('disabled element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-disable').length).toEqual(10);
        });

        it('numericcontainer element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toEqual(10);
        });

        it('pager message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar').length).toEqual(1);
        });

        it('pager external message element testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(0);
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('Method testing', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });

        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5, 
                });
            pagerObj.appendTo('#Pager');
            setTimeout(() => { done(); }, 1000);
        });

        it('getPersistData testing', () => {
            expect(pagerObj.getPersistData()).toEqual('{"enableExternalMessage":false,"enablePagerMessage":true,"currentPage":8,"pageSize":5,"pageCount":5,"totalRecordsCount":100,"customText":""}');
        });

        it('getLocalizedLabel testing', () => {
            expect(pagerObj.getLocalizedLabel('firstPageTooltip')).toEqual('Go to first page');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

    describe('pager onproperty changed', () => {
        let pagerObj: Pager;
        let elem: HTMLElement = createElement('div', { id: 'Pager' });
        beforeAll((done: Function) => {
            let created: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pagerObj = new Pager(
                {
                    totalRecordsCount: 100, currentPage: 8, pageCount: 5, pageSize: 5,
                    enablePagerMessage: true, enableExternalMessage: true, externalMessage: 'externalMessage',
                     enableRtl: true, enableQueryString: true, customText: 'sheet',
                    created: created
                });
            pagerObj.appendTo('#Pager');
        });

        it('totalRecordsCount testing', () => {
            pagerObj.totalRecordsCount = 200;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('8 of 40 pages (200 items)');
        });

        it('pageSize testing', () => {
            pagerObj.pageSize = 6;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('8 of 34 pages (200 items)');
        });

        it('pageCount testing', () => {
            pagerObj.pageCount = 6;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-numericcontainer')[0].childNodes.length).toEqual(6);
        });

        it('currentPage testing', () => {
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('8');
            pagerObj.currentPage = 13;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('13');
        });

        it('currentPage invalid value testing', () => {
            pagerObj.currentPage = -1;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].getAttribute('index')).toEqual('13');
            pagerObj.currentPage = 13;
            pagerObj.dataBind();
        });

        it('enablePagerMessage false testing', () => {
            pagerObj.enablePagerMessage = false;
            pagerObj.dataBind();
            expect((pagerObj.element.querySelectorAll('.e-parentmsgbar')[0] as HTMLElement).style.display).toEqual('');
        });

        it('enablePagerMessage true testing', () => {
            pagerObj.enablePagerMessage = true;
            pagerObj.dataBind();
            expect((pagerObj.element.querySelectorAll('.e-parentmsgbar')[0] as HTMLElement).style.display).not.toEqual('none');
        });

        it('enableExternalMessage false testing', () => {
            pagerObj.enableExternalMessage = false;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(0);
        });

        it('enableExternalMessage true testing', () => {
            pagerObj.enableExternalMessage = true;
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg').length).toEqual(1);
        });

        it('enable pager external message testing', () => {
            pagerObj.externalMessage = 'modified';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('modified');
        });       

        it('rtl false testing', () => {
            pagerObj.enableRtl = false;
            pagerObj.dataBind();
            expect(pagerObj.element.classList.contains('e-rtl')).toEqual(false);
        });

        it('rtl true testing', () => {
            pagerObj.enableRtl = true;
            pagerObj.dataBind();
            expect(pagerObj.element.classList.contains('e-rtl')).toEqual(true);
        });

        it('custom text testing', () => {
            pagerObj.customText = 'spreadsheet';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-active')[0].textContent).toEqual('spreadsheet13');
        });

        it('querystring testing', () => {
            pagerObj.enableQueryString = false;
            pagerObj.dataBind();
            pagerObj.goToPage(14);
            expect(window.location.href.indexOf('?page=14')).not.toBeGreaterThan(-1);
            pagerObj.enableQueryString = true;
            pagerObj.dataBind();
            pagerObj.goToPage(15);
            expect(window.location.href.indexOf('?page=15')).toBeGreaterThan(-1);
        });

        it('locale testing', () => {
            pagerObj.locale = 'de-DE';
            pagerObj.dataBind();
            expect(pagerObj.element.querySelectorAll('.e-parentmsgbar')[0].textContent).toEqual('15 van 34 pagina ( 200 items)');
        });

        afterAll(() => {
            pagerObj.destroy();
            elem.remove();
        });

    });

});