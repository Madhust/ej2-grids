/**
 * Grid column menu spec document
 */
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { ColumnMenuItemModel } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement, remove, EmitType, Browser } from '@syncfusion/ej2-base';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ColumnMenu } from '../../../src/grid/actions/column-menu';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Filter } from '../../../src/grid/actions/filter';
import { Resize } from '../../../src/grid/actions/resize';
import { Edit } from '../../../src/grid/actions/edit';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import { Column } from '../../../src/grid/models/column';
import { ContextMenuItemModel } from '../../../src/grid/base/interface';
import { OffsetPosition, calculatePosition } from '@syncfusion/ej2-popups';
import { ContextMenuModel } from '@syncfusion/ej2-navigations';
import { createCheckBox } from '@syncfusion/ej2-buttons';

Grid.Inject(Page, Selection, Reorder, CommandColumn, ColumnMenu, Sort, Resize,
    Group, Edit, PdfExport, ExcelExport, Filter);

describe('column menu module', () => {
    describe('default items', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true },
                    allowResizing: true,
                    allowSorting: true,
                    editSettings: { allowDeleting: true, allowEditing: true },
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    allowFiltering: true,
                    filterSettings: { type: 'checkbox' },
                    allowExcelExport: true,
                    allowPdfExport: true,
                    showColumnMenu: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120, showColumnMenu: false },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170, showInColumnChooser: false },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });
        it('Icon check in header', () => {
            expect(gridObj.element.querySelectorAll('.e-columnmenu').length).toBe(4);
            expect(gridObj.element.querySelectorAll('.e-icon-filter').length ).toBe(1);
            expect((gridObj.columnMenuModule as any).getColumnMenuHandlers().length ).toBe(4);
        });
        it('colum menu - render', () => {
            expect((gridObj.columnMenuModule as any).element).not.toBe(null);
            expect((gridObj.columnMenuModule as any).element.id).toBe(gridObj.element.id + '_columnmenu');
            expect((gridObj.columnMenuModule as any).columnMenu.enableRtl).toBe(gridObj.enableRtl);
            expect((gridObj.columnMenuModule as any).columnMenu.locale).toBe(gridObj.locale);
            expect((gridObj.columnMenuModule as any).columnMenu.enablePersistence).toBe(gridObj.enablePersistence);
            expect((gridObj.columnMenuModule as any).columnMenu.target).toBe('');
            expect((gridObj.columnMenuModule as any).columnMenu.cssClass).toBe('e-grid-menu');
            expect((gridObj.columnMenuModule as any).columnMenu.items.length).toBe(8);
            expect((gridObj.columnMenuModule as any).getModuleName()).toBe('columnMenu');
            expect(gridObj.columnMenuModule.getColumnMenu()).toBe((gridObj.columnMenuModule as any).element);
        });

        it('click handler', (done) => {
            let colMenu = gridObj.columnMenuModule as any;
            expect(colMenu.isOpen).toBe(false);
            let eve = {
                target: gridObj.element.querySelector('.e-columnmenu'),
                preventDefault: function () { }
            };
            colMenu.columnMenuHandlerDown(eve);
            expect(colMenu.isOpen).toBe(false);
            colMenu.openColumnMenuDummy = colMenu.openColumnMenu;
            colMenu.openColumnMenu = function () {
                colMenu.element.style.display = 'block';
                done();
            };
            colMenu.columnMenuHandlerClick(eve);
        });
        it('click handler - again open', (done) => {
            let colMenu = gridObj.columnMenuModule as any;
            let eve = {
                target: gridObj.element.querySelectorAll('.e-columnmenu')[1],
                preventDefault: function () { }
            };
            colMenu.columnMenuHandlerDown(eve);
            expect(colMenu.isOpen).toBe(true);
            colMenu.openColumnMenu = function () {
                colMenu.element.style.display = 'block';
                colMenu.openColumnMenu = colMenu.openColumnMenuDummy;
                done();
            };
            colMenu.columnMenuHandlerClick(eve);
        });
        it('click handler - again close', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let eve = {
                target: gridObj.element.querySelectorAll('.e-columnmenu')[1],
                preventDefault: function () { }
            };
            colMenu.columnMenuHandlerDown(eve);
            expect(colMenu.isOpen).toBe(true);
            colMenu.headerCell = colMenu.getHeaderCell(eve);
            colMenu.columnMenuHandlerClick(eve);
            colMenu.columnMenuHandlerDown(eve);
            expect(colMenu.isOpen).toBe(false);
        });
        it('openColumnMenu', (done) => {
            let colMenu = gridObj.columnMenuModule as any;
            let columnMenuObj = colMenu.columnMenu as ContextMenuModel;
            let eve = {
                target: gridObj.element.querySelectorAll('.e-columnmenu')[1],
                preventDefault: function () { }
            };
            colMenu.openColumnMenu(eve);
            expect(colMenu.headerCell).not.toBe(null);
            columnMenuObj.onOpen = function (args) {
                let pos = calculatePosition(colMenu.headerCell, 'left', 'bottom');
                colMenu.columnMenu.close();
                done();
            }
        });
        it('openColumnMenu - rtl', (done) => {
            let colMenu = gridObj.columnMenuModule as any;
            let columnMenuObj = colMenu.columnMenu as ContextMenuModel;
            let eve = {
                target: gridObj.element.querySelectorAll('.e-columnmenu')[1],
                preventDefault: function () { }
            };
            gridObj.enableRtl = true,
                gridObj.dataBind();
            colMenu.openColumnMenu(eve);
            columnMenuObj.onOpen = function (args) {
                let pos = calculatePosition(colMenu.headerCell, 'right', 'bottom');
                let elePos: ClientRect = colMenu.element.getBoundingClientRect();
                pos.left -= colMenu.headerCell.getBoundingClientRect().width;
                colMenu.columnMenu.close();
                gridObj.enableRtl = false;
                gridObj.dataBind();
                done();
            }
        });
        it('Is filter item added with default', () => {
            let colMenu = gridObj.columnMenuModule as any;
            expect(colMenu.isFilterItemAdded()).toBe(true);
        });
        it('chooser item check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let item = colMenu.defaultItems['filter'];
            expect(colMenu.isChooserItem( item )).toBe(false);
            item = {text: 'OrderID'};
            item.id = colMenu.generateID(item.text, '_chooser_');
            expect(colMenu.isChooserItem(item)).toBe(true);
            item = { text: 'item2' };
            expect(colMenu.isChooserItem(item)).toBe(undefined);
            item = { text: 'item2', id: 'asdfis' };
            expect(colMenu.isChooserItem(item )).toBe(false);
        });

        it('before item render check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let args = {
                item: colMenu.defaultItems['filter'],
                element: document.createElement('span')
            }
            colMenu.beforeMenuItemRender(args);
            expect(args.element.classList.contains('e-filter-icon'));
            expect(args.element.classList.contains('e-menu-caret-icon'));
            expect(args.element.querySelectorAll('.e-icons.e-caret').length).toBe(1);
            let item = {
                text: 'OrderID',
                id: colMenu.generateID('OrderID', '_chooser_')
            };
            args = {
                item: item,
                element: document.createElement('span')
            }
            colMenu.beforeMenuItemRender(args);
            expect(args.element.querySelectorAll('.e-checkbox-wrapper').length).toBe(1);
            gridObj.enableRtl = true;
            gridObj.dataBind();
            args = {
                item: item,
                element: document.createElement('span')
            }
            colMenu.beforeMenuItemRender(args);
            expect(args.element.querySelectorAll('.e-rtl').length).toBe(1);
            gridObj.enableRtl = false;
            gridObj.dataBind();
        });

        it('before close check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let args = {
                parentItem: colMenu.defaultItems['columnChooser'],
                event: {
                    target: createElement('span', { className: 'e-menu-parent' })
                },
                cancel: false
            };
            colMenu.columnMenuBeforeClose(args);
            expect(args.cancel).toBe(true);
            let target = createElement('span', { className: 'e-popup' })
            let tar = createElement('span', { className: 'e-filters' });
            target.appendChild(tar);
            args = {
                parentItem: colMenu.defaultItems['columnChooser'],
                event: { target: tar },
                cancel: false
            };
            colMenu.columnMenuBeforeClose(args);
            expect(args.cancel).toBe(true);
        });

        it('columnMenuBeforeOpen check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let colMenuObj = colMenu.columnMenu as ContextMenuItemModel;
            colMenu.columnMenuBeforeOpen({ items: colMenuObj.items });
            expect(colMenu.hiddenItems.length).toBe(0);
            expect(colMenu.disableItems.length).toBe(1);
            expect(colMenu.targetColumn).not.toBe(null);
        });

        it('columnMenuBeforeOpen - hidden- check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let colMenuObj = colMenu.columnMenu as ContextMenuItemModel;
            gridObj.columnMenuOpen = function (args) {
                (args.items[0] as ColumnMenuItemModel).hide = true;
            }
            gridObj.sortColumn(colMenu.targetColumn.field, 'ascending');
            colMenu.columnMenuBeforeOpen({ items: colMenuObj.items });
            expect(colMenu.hiddenItems.length).toBe(1);
        });

        it('ensureDisabledStatus check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let colMenuObj = colMenu.columnMenu as ContextMenuItemModel;
            for (let item of colMenuObj.items) {
                expect(colMenu.ensureDisabledStatus(item));
                colMenu.columnMenuItemClick({item: item, element: document.createElement('span')});
            }
        });

        it('chooser item click action check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let colMenuObj = colMenu.columnMenu as ContextMenuItemModel;
            let elem = createElement('span', {className: 'e-columnchooser'});
            elem.appendChild(createCheckBox(false,{label: 'OrderID', checked: false}));
            let columnChooseritem = colMenu.defaultItems['columnChooser'] as ContextMenuItemModel;
            let args = {item: columnChooseritem.items[0], element: elem};
            colMenu.columnMenuItemClick(args);
            expect(args.element.querySelectorAll('.e-check').length).toBe(1);
            colMenu.columnMenuItemClick(args);
            expect(args.element.querySelectorAll('.e-check').length).toBe(0);
        });

        it('columnMenuOnClose check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let colMenuObj = colMenu.columnMenu as ContextMenuItemModel;
            colMenu.columnMenuOnClose({items: colMenuObj.items});
            expect(colMenu.hiddenItems.length).toBe(0);
            expect(colMenu.disableItems.length).toBe(0);
        });

        it('icon check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let GROUP: string = 'e-icon-group';
            let UNGROUP: string = 'e-icon-ungroup';
            let ASCENDING: string = 'e-icon-ascending';
            let DESCENDING: string = 'e-icon-descending';
            let FILTER: string = 'e-icon-filter';
            expect(colMenu.defaultItems['filter'].iconCss.indexOf(FILTER) >= 0).toBe(true);
            expect(colMenu.defaultItems['group'].iconCss.indexOf(GROUP) >= 0).toBe(true);
            expect(colMenu.defaultItems['ungroup'].iconCss.indexOf(UNGROUP) >= 0).toBe(true);
            expect(colMenu.defaultItems['sortAscending'].iconCss.indexOf(ASCENDING) >= 0).toBe(true);
            expect(colMenu.defaultItems['sortDescending'].iconCss.indexOf(DESCENDING) >= 0).toBe(true);
        });
        it('chooser item check', () => {
            expect((gridObj.columnMenuModule as any).defaultItems['columnChooser'].items.length === gridObj.getColumns().length - 1).toBe(true);
        });

        it('appendFilter check', (done) => {
            let colMenu = gridObj.columnMenuModule as any;
            let element = createElement('span', {id: colMenu.defaultItems['filter'].id});
            colMenu.appendFilter({target: element});
            expect(colMenu.isFilterPopupOpen()).toBe(true);
            expect(colMenu.getFilterPop().classList.contains('e-col-menu'));
            gridObj.actionComplete = function(args){
                if(args.requestType === 'filterafteropen'){
                    done();
                }
            }
        });

        it('appendFilter check - close', (done) => {
            let colMenu = gridObj.columnMenuModule as any;
            colMenu.appendFilter({target: createElement('span', {id: 'assa'})});
            expect(colMenu.isFilterPopupOpen()).toBe(false);
            done();
        });

        it('close filter by column menu close check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            let element = createElement('span', {id: colMenu.defaultItems['filter'].id});
            colMenu.appendFilter({target: element});
            let args = {
                element: createElement('span', {id: 'asdfa'}),
                items: colMenu.columnMenu.items
            }
            colMenu.columnMenuOnClose(args);
            expect(colMenu.isFilterPopupOpen()).toBe(false);
        });
        

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });

    describe('columnMenuItem', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    allowFiltering: true,
                    showColumnMenu: true,
                    columnMenuItems: ['columnChooser'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120, showColumnMenu: false },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170, showInColumnChooser: false },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });
        it('isFilterItemAdded', () => {
           let colMenu = gridObj.columnMenuModule as any;
           expect(colMenu.isFilterItemAdded()).toBe(false);
        });
        it('default', () => {
            let colMenu = gridObj.columnMenuModule as any;
            expect(colMenu.getDefault().length).toBe(3);
         });
         it('disabled status', () => {
            let colMenu = gridObj.columnMenuModule as any;
            expect(colMenu.ensureDisabledStatus('group')).toBe(true);
            expect(colMenu.ensureDisabledStatus('sortAscending')).toBe(true);
         });
         it('filter - null- check', () => {
            let colMenu = gridObj.columnMenuModule as any;
            expect(colMenu.appendFilter()).toBe(undefined);
         });

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
    describe('custom item', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let iphoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6' +
            ' (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1';
            Browser.userAgent = iphoneUa;
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    allowFiltering: true,
                    showColumnMenu: true,
                    columnMenuItems: [{text: 'clear sorting'}],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120, showColumnMenu: false },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170, showInColumnChooser: false },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });
        it('count check', () => {
            let status = true;
            let colMenu = gridObj.columnMenuModule as any;
            for (var key in colMenu.defaultItems) {
                if (colMenu.defaultItems.hasOwnProperty(key))
                    status = false;
            }
            expect(status).toBe(true);
            expect(colMenu.columnMenu.items.length).toBe(1);           
        });

        it(' browser menu open', () => {
            let colMenu = gridObj.columnMenuModule as any;
            expect(colMenu.isOpen).toBe(false);
            let eve = {
                target: gridObj.element.querySelector('.e-columnmenu'),
                preventDefault: function () { }
            };
            colMenu.columnMenuHandlerDown(eve);
            expect(colMenu.isOpen).toBe(false);
            colMenu.columnMenuHandlerClick(eve);
            colMenu.removeEventListener();
        });

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
        });
    });
});