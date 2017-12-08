/**
 * Grid PDF Export spec document
 */
/* tslint:disable */
import { EmitType, EventHandler } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { data, image, rData, employeeData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { QueryCellInfoEventArgs, PdfExportProperties } from '../../../src/grid/base/interface';
Grid.Inject(Page, Group, Selection, Toolbar, PdfExport);

describe('PDF Export', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    function QueryCellEvent(args: QueryCellInfoEventArgs): void {
        let data: any = args.data;
        if (args.column.field == 'Freight' && data.Freight > 50) {
            args.colSpan = 2;
        }
    }

    let rData = new DataManager(data.slice(10, 15) as JSON[]);
    let remoteData: PdfExportProperties = {
        dataSource: rData,
        pageSize: 'legal',
        pageOrientation: 'landscape',
    }

    let exportproperties: PdfExportProperties = {
        exportType: 'currentpage',
        includeHiddenColumn: true,
        pageSize: 'letter',
        pageOrientation: 'portrait',
        header: {
            fromTop: 0,
            height: 150,
            contents: [
                {
                    type: 'image',
                    src: image,
                    position: { x: 250, y: 10 },
                    size: { height: 100, width: 250 },
                },
                {
                    type: 'line',
                    style: { penColor: '#C67878', penSize: 2, dashStyle: 'solid' },
                    points: { x1: 0, y1: 4, x2: 500, y2: 4 }
                },
                {
                    type: 'line',
                    style: { penColor: '#C67878', penSize: 2, dashStyle: 'dot' },
                    points: { x1: 0, y1: 7, x2: 500, y2: 7 }
                },
                {
                    type: 'line',
                    style: { penColor: '#C67878', penSize: 2, dashStyle: 'dot' },
                    points: { x1: 0, y1: 114, x2: 500, y2: 114 }
                },
                {
                    type: 'line',
                    style: { penColor: '#C67878', penSize: 2, dashStyle: 'solid' },
                    points: { x1: 0, y1: 117, x2: 500, y2: 117 }
                },
                {
                    type: 'pagenumber',
                    pageNumberType: 'arabic',
                    format: 'Page {$current} of {$total}', //optional
                    position: { x: 0, y: 25 },
                    // size: { height: 40, width: 200 }, //optional
                    style: { textBrushColor: '#C67878', fontSize: 15, hAlign: 'center' }
                },
                {
                    type: 'text',
                    value: "Northwind Traders",
                    position: { x: 0, y: 50 },
                    style: { textBrushColor: '#000000', fontSize: 13 }
                },
                {
                    type: 'text',
                    value: "2501 Aerial Center Parkway",
                    position: { x: 0, y: 75 },
                    style: { textBrushColor: '#000000', fontSize: 13 }
                },
                {
                    type: 'text',
                    value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
                    position: { x: 0, y: 100 },
                    style: { textBrushColor: '#000000', fontSize: 13 }
                },
            ]
        },
        footer: {
            fromBottom: 160,
            height: 150,
            contents: [
                {
                    type: 'image',
                    src: image,
                    position: { x: 250, y: 10 },
                    size: { height: 100, width: 250 },
                },
                {
                    type: 'line',
                    style: { penColor: '#000055', penSize: 2, dashStyle: 'solid' },
                    points: { x1: 0, y1: 4, x2: 500, y2: 4 }
                },
                {
                    type: 'line',
                    style: { penColor: '#000055', penSize: 2, dashStyle: 'dot' },
                    points: { x1: 0, y1: 7, x2: 500, y2: 7 }
                },
                {
                    type: 'line',
                    style: { penColor: '#000055', penSize: 2, dashStyle: 'dot' },
                    points: { x1: 0, y1: 114, x2: 500, y2: 114 }
                },
                {
                    type: 'line',
                    style: { penColor: '#000055', penSize: 2, dashStyle: 'solid' },
                    points: { x1: 0, y1: 117, x2: 500, y2: 117 }
                },
                {
                    type: 'pagenumber',
                    pageNumberType: 'arabic',
                    format: 'Page {$current} of {$total}', //optional
                    position: { x: 0, y: 25 },
                    // size: { height: 40, width: 200 }, //optional
                    style: { textBrushColor: '#000000', fontSize: 15, hAlign: 'center' }
                },
                {
                    type: 'text',
                    value: "Northwind Traders",
                    position: { x: 0, y: 50 },
                    style: { textBrushColor: '#000000', fontSize: 13 }
                },
                {
                    type: 'text',
                    value: "2501 Aerial Center Parkway",
                    position: { x: 0, y: 75 },
                    style: { textBrushColor: '#000000', fontSize: 13 }
                },
                {
                    type: 'text',
                    value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
                    position: { x: 0, y: 100 },
                    style: { textBrushColor: '#000000', fontSize: 13 }
                },
            ]
        }
    }

    let customAggregateFn1 = (data: Object[]) => data.filter((item: any) => item.Freight > 50).length;
    afterAll(() => {
        remove(elem);
    });
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data,
                allowPdfExport: true,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
                toolbar: ['pdfexport'],
                pageSettings: { pageCount: 5 },
                pdfQueryCellInfo: QueryCellEvent,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: '120px' },
                    {
                        field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'right',
                        textAlign: 'right', width: '15%', format: 'yMd'
                    },
                    { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    { field: 'ShipRegion', width: 140 },
                    { field: 'Verified', width: 140 },
                    {
                        headerText: 'Ship Details', headerTextAlign: 'justify', columns: [
                            { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                            { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    { field: 'InvalidOrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { headerText: 'Order Date 1', field: 'OrderDate', type: 'date', format: 'MMMEd' },
                    { headerText: 'Order Date 2', field: 'OrderDate', format: { type: 'date', skeleton: 'MMMEd' } },
                    { headerText: 'Order Date 3', field: 'OrderDate', type: 'date', format: { skeleton: 'MMMEd' } },
                    { headerText: 'Order Date 4', field: 'OrderDate', format: { skeleton: 'MMMEd' } },
                    { headerText: 'Order Date 5', field: 'OrderDate', type: 'datetime', format: 'MMMEd' },
                    { headerText: 'Order Date 6', field: 'OrderDate', format: { type: 'datetime', skeleton: 'MMMEd' } },
                    { headerText: 'Order Date 7', field: 'OrderDate', type: 'datetime', format: { skeleton: 'MMMEd' } },
                    { headerText: 'Order Date 8', field: 'OrderDate', type: 'date', format: 'short' },
                    { headerText: 'Order Date 9', field: 'OrderDate', type: 'date', format: 'long' },
                    { headerText: 'Order Date 10', field: 'OrderDate', type: 'date', format: 'medium' },
                    { headerText: 'Order Date 11', field: 'OrderDate', type: 'date', format: 'full' },
                    { headerText: 'Order Date 12', field: 'OrderDate', type: 'datetime', format: 'short' },
                    { headerText: 'Order Date 13', field: 'OrderDate', type: 'datetime', format: 'long' },
                    { headerText: 'Order Date 14', field: 'OrderDate', type: 'datetime', format: 'medium' },
                    { headerText: 'Order Date 15', field: 'OrderDate', type: 'datetime', format: 'full' },
                    { headerText: 'Order Date 16', field: 'OrderDate', type: 'time', format: 'short' },
                    { headerText: 'Order Date 17', field: 'OrderDate', type: 'time', format: 'long' },
                    { headerText: 'Order Date 18', field: 'OrderDate', type: 'time', format: 'medium' },
                    { headerText: 'Order Date 19', field: 'OrderDate', type: 'time', format: 'full' },
                    { headerText: 'Order Date 20', field: 'OrderDate', format: { type: 'time', skeleton: 'short' } },
                    { headerText: 'Order Date 21', field: 'OrderDate', format: { type: 'time', skeleton: 'long' } },
                    { headerText: 'Order Date 22', field: 'OrderDate', format: { type: 'time', skeleton: 'medium' } },
                    { headerText: 'Order Date 23', field: 'OrderDate', format: { type: 'time', skeleton: 'full' } },
                    { headerText: 'Order Date 24', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'short' } },
                    { headerText: 'Order Date 25', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'long' } },
                    { headerText: 'Order Date 26', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'medium' } },
                    { headerText: 'Order Date 27', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'full' } },
                    { headerText: 'Order Date 28', field: 'OrderDate', type: 'time', format: { skeleton: 'full' } },
                    { headerText: 'Order Date 29', field: 'OrderDate', type: 'datetime', format: { type: 'datetime', skeleton: 'MMMEd' } },
                ],
                aggregates: [{
                    columns: [
                        {
                            type: 'min',
                            field: 'Freight',
                            format: 'C2',
                            groupFooterTemplate: 'Min: ${min}'
                        },
                        {
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            groupFooterTemplate: 'Max: ${max}'
                        }, {
                            type: 'max',
                            field: 'Freight',
                            format: 'C2',
                            groupCaptionTemplate: 'Max: ${max}'
                        }, {
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            groupCaptionTemplate: 'Max: ${max}'
                        }
                    ]
                },
                {
                    columns: [{
                        type: 'max',
                        field: 'Freight',
                        format: 'C2'
                    }]
                }, {
                    columns: [{
                        type: 'custom',
                        customAggregate: customAggregateFn1,
                        field: 'Freight',
                    }]
                }, {
                    columns: [{
                        type: 'custom',
                        customAggregate: customAggregateFn1,
                        columnName: 'Freight',
                    }]
                }]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('Custom Theme', (done) => {
        gridObj.pdfExport({
            theme: {
                header: {
                    fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, bold: true, borders: { color: '#64FA50', lineStyle: 'thin' }
                },
                record: {
                    fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, bold: true
                },
                caption: {
                    fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, bold: true
                }
            }
        });
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('material', (done) => {
        gridObj.pdfExport();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('exportproperties = undefined', (done) => {
        gridObj.pdfExport(undefined);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('header and footer', (done) => {
        gridObj.pdfExport(exportproperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('empty exportproperties', (done) => {
        gridObj.pdfExport({});
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('remote data', (done) => {
        gridObj.pdfExport(remoteData);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
});

/* tslint:enable */